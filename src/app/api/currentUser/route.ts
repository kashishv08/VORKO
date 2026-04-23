export const dynamic = "force-dynamic";
// src/app/api/currentUser/route.ts
import { getCurrentUserFromDB } from "@/src/lib/helper";
import { prismaClient } from "@/src/lib/service/prisma";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const user = await getCurrentUserFromDB();
  return NextResponse.json(user);
}
