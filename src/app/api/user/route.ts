import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  const user = await currentUser();
  return NextResponse.json({ session, user });
}
