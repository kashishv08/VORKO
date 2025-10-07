import { prismaClient } from "@/src/lib/service/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, role } = await req.json();
    if (!email || !role)
      return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const user = await prismaClient.user.findUnique({ where: { email } });
    if (user && user.role !== role) {
      return NextResponse.json({ roleConflict: true, existingRole: user.role });
    }

    return NextResponse.json({ roleConflict: false });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
