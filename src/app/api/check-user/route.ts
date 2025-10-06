import { prismaClient } from "@/src/lib/service/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  const existing = await prismaClient.user.findUnique({
    where: { email },
  });

  if (existing) {
    return NextResponse.json({ exists: true, role: existing.role });
  }

  return NextResponse.json({ exists: false });
}
