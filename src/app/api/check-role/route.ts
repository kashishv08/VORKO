export const dynamic = "force-dynamic";
import { prismaClient } from "@/src/lib/service/prisma";
import { clerkClient } from "@/src/lib/service/clerk";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { clerkId, role, email, name } = await req.json();
    if (!clerkId || !role)
      return NextResponse.json(
        { success: false, error: "Missing data" },
        { status: 400 }
      );

    const user = await prismaClient.user.findUnique({ where: { clerkId } });
    if (user && user.role !== role) {
      return NextResponse.json({
        success: false,
        roleConflict: true,
        existingRole: user.role,
      });
    }

    if (!user) {
      await prismaClient.user.create({
        data: {
          clerkId,
          email: email || "",
          name: name || "",
          role,
          onboardingComplete: false,
          password: "",
        },
      });
    }

    // ✅ Sync to Clerk Public Metadata (Safe Update)
    const clerkUser = await clerkClient.users.getUser(clerkId);
    await clerkClient.users.updateUser(clerkId, {
      publicMetadata: { 
        ...clerkUser.publicMetadata, 
        role 
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in /api/check-role:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
