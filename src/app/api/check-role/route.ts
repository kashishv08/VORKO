import { prismaClient } from "@/src/lib/service/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { clerkId, role } = await req.json();
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

    // optional: create user if not found
    if (!user) {
      await prismaClient.user.create({
        data: {
          clerkId,
          email: "", // Clerk webhook will fill later
          name: "",
          role,
          onboardingComplete: false,
          password: "",
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error in /api/check-role:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
