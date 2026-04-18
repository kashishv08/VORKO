import { NextResponse } from "next/server";
import { StreamClient } from "@stream-io/node-sdk";
import { auth, currentUser } from "@clerk/nextjs/server";
import { prismaClient } from "@/src/lib/service/prisma";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;

export async function POST(req: Request) {
  try {
    const { userId: clerkUserId } = await auth();
    if (!clerkUserId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    const body = await req.json();
    const { contractId } = body;
    if (!contractId)
      return NextResponse.json(
        { error: "contractId missing" },
        { status: 400 }
      );

    console.log("Request body:", body);

    // 1️⃣ Fetch internal user
    const dbUser = await prismaClient.user.findUnique({
      where: { clerkId: clerkUserId },
    });
    if (!dbUser)
      return NextResponse.json(
        { error: "User not found in DB" },
        { status: 404 }
      );

    const streamClient = new StreamClient(apiKey, apiSecret);

    // 2️⃣ Upsert user on Stream
    await streamClient.upsertUsers([
      {
        id: dbUser.id, // internal user ID
        name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
        role: "user",
        image: user.imageUrl,
      },
    ]);

    let meeting = await prismaClient.meeting.findUnique({
      where: { contractId },
    });

    if (!meeting) {
      const callType = "default";
      const callId = contractId;
      const call = streamClient.video.call(callType, callId);
      await call.getOrCreate({
        data: {
          members: [{ user_id: dbUser.id, role: "admin" }],
          created_by_id: dbUser.id,
        },
      });

      meeting = await prismaClient.meeting.upsert({
        where: { contractId },
        update: {}, // no update needed if exists
        create: {
          contractId,
          streamMeetingId: callId,
        },
      });
    }

    const token = streamClient.generateUserToken({
      user_id: dbUser.id,
      iat: Math.floor(Date.now() / 1000) - 60,
    });

    return NextResponse.json({
      token,
      apiKey,
      userId: dbUser.id,
      streamMeetingId: meeting.streamMeetingId,
    });
  } catch (err) {
    console.error("Stream token error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
