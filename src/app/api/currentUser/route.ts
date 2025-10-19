// src/app/api/currentUser/route.ts
import { getCurrentUserFromDB } from "@/src/lib/helper";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getCurrentUserFromDB();
  return NextResponse.json(user);
}
