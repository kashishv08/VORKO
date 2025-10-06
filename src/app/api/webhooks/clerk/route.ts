// app/api/webhooks/clerk/route.ts
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
    const role = unsafe_metadata?.role ?? public_metadata?.role ?? "CLIENT";

    // check existing by email
    const existingUser = await prismaClient.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.role === role) {
        // already exists with same role -> do nothing (idempotent)
        console.log("User exists, same role -> skipping create.");
        return NextResponse.json({ status: "exists", role });
      }

      // role conflict: do not overwrite existing user
      console.warn(
        `Role conflict for ${email}: existing=${existingUser.role} attempted=${role}`
      );
      // reply with 400 so it can be observed in logs; frontend will handle via /onboard check instead
      return NextResponse.json(
        { status: "role_conflict", existingRole: existingUser.role },
        { status: 400 }
      );
    }

    // create new user
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
      },
    });

    // sync role metadata into Clerk public metadata (optional)
    if (public_metadata?.role !== role) {
      await clerkClient.users.updateUserMetadata(clerkId, {
        publicMetadata: { ...public_metadata, role },
      });
    }

    return NextResponse.json({ status: "created", role });
  }

  // safe delete handling
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

      if (!user) {
        return NextResponse.json({ status: "not_found" });
      }

      // if user has any linked records -> do NOT hard delete
      const hasLinked =
        (user.projects?.length || 0) +
        (user.proposals?.length || 0) +
        (user.clientContracts?.length || 0) +
        (user.freelancerContracts?.length || 0) +
        (user.messages?.length || 0) +
        (user.reviews?.length || 0);

      if (hasLinked) {
        // Option: mark as soft-deleted (or just log & return)
        await prismaClient.user.update({
          where: { clerkId },
          data: { onboardingComplete: false }, // or set deletedAt: new Date() if you add that field
        });
        console.warn(
          `User ${clerkId} not deleted because linked records exist.`
        );
        return NextResponse.json(
          { status: "has_linked_records" },
          { status: 400 }
        );
      }

      // safe to delete
      await prismaClient.user.delete({ where: { clerkId } });
      return NextResponse.json({ status: "deleted" });
    } catch (err) {
      console.error("Webhook delete error", err);
      return NextResponse.json({ error: "delete_failed" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}
