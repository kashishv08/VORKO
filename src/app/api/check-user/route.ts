// /api/check-user.ts
import { prismaClient } from "@/src/lib/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, clerkId } = await req.json();

  const existing = await prismaClient.user.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json({
      exists: true,
      role: existing.role,
      onboardingComplete: existing.onboardingComplete,
      sameClerkId: existing.clerkId === clerkId, // ✅ check if same or different user
    });
  }

  return NextResponse.json({ exists: false });
}
