import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { prismaClient } from "@/src/lib/service/prisma";
import { clerkClient } from "@/src/lib/service/clerk";

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const heads = await headers();
  const svix_id = heads.get("svix-id");
  const svix_timestamp = heads.get("svix-timestamp");
  const svix_signature = heads.get("svix-signature");
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt;
  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id!,
      "svix-timestamp": svix_timestamp!,
      "svix-signature": svix_signature!,
    });
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created" || type === "user.updated") {
    const {
      id: clerkId,
      email_addresses,
      first_name,
      last_name,
      public_metadata,
      unsafe_metadata,
      image_url,
    } = data;

    const email = email_addresses?.[0]?.email_address ?? "";
    const name = ((first_name || "") + " " + (last_name || "")).trim();
    const role = unsafe_metadata?.role ?? public_metadata?.role ?? null;

    if (!role) {
      console.warn("User created without role; skipping DB creation");
      return NextResponse.json({ status: "skipped" });
    }

    // check by clerkId
    const existingUser = await prismaClient.user.findUnique({
      where: { clerkId },
    });

    if (existingUser) {
      if (existingUser.role === role) {
        // already exists -> do nothing
        return NextResponse.json({ status: "exists", role });
      }

      // role conflict
      return NextResponse.json(
        { status: "role_conflict", existingRole: existingUser.role },
        { status: 400 }
      );
    }

    // create user in DB BEFORE onboarding
    await prismaClient.user.create({
      data: {
        clerkId,
        email,
        name,
        role,
        bio: null,
        skills: [],
        avatar: image_url ?? "",
        onboardingComplete: false,
        password: "",
      },
    });

    // update Clerk public metadata
    if (public_metadata?.role !== role) {
      await clerkClient.users.updateUser(clerkId, {
        publicMetadata: { ...public_metadata, role },
      });
    }

    return NextResponse.json({ status: "created", role });
  }

  if (type === "user.deleted") {
    const clerkId = data.id;
    try {
      const user = await prismaClient.user.findUnique({
        where: { clerkId },
        include: {
          projects: true,
          proposals: true,
          clientContracts: true,
          freelancerContracts: true,
          messages: true,
          reviews: true,
        },
      });

      if (!user) return NextResponse.json({ status: "not_found" });

      // delete related records first
      await prismaClient.$transaction([
        prismaClient.project.deleteMany({ where: { clientId: user.id } }),
        prismaClient.contract.deleteMany({
          where: { OR: [{ clientId: user.id }, { freelancerId: user.id }] },
        }),
        prismaClient.user.delete({ where: { id: user.id } }),
      ]);

      return NextResponse.json({ status: "deleted" });
    } catch (err) {
      console.error("Webhook delete error", err);
      return NextResponse.json({ error: "delete_failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
