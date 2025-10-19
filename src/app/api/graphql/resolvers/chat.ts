// resolvers/chat.ts
import { prismaClient } from "@/src/lib/service/prisma";
import { auth } from "@clerk/nextjs/server";
import { StreamChat } from "stream-chat";

async function getCurrentUserFromDB() {
  const { userId } = await auth();
  // console.log("gql wala userid", userId);
  if (!userId) return null;
  return await prismaClient.user.findUnique({ where: { clerkId: userId } });
}

export const generateChatToken = async (
  _: unknown,
  args: { contractId: string }
) => {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
  const apiSecret = process.env.STREAM_API_SECRET!;

  if (!apiKey || !apiSecret) {
    throw new Error("Stream API key or secret is missing.");
  }

  const user = await getCurrentUserFromDB();
  if (!user) throw new Error("Not authenticated");

  // ✅ ensure this user is part of the contract
  const contract = await prismaClient.contract.findUnique({
    where: { id: args.contractId },
  });

  if (
    !contract ||
    (user.id !== contract.clientId && user.id !== contract.freelancerId)
  ) {
    throw new Error("You are not authorized for this contract");
  }

  const serverClient = StreamChat.getInstance(apiKey, apiSecret);

  const token = serverClient.createToken(user.id);

  return { token };
};

export const getUserChats = async () => {
  const user = await getCurrentUserFromDB();
  if (!user) throw new Error("Not authenticated");

  // console.log(user);

  // Fetch contracts where the user is either client or freelancer
  const contracts = await prismaClient.contract.findMany({
    where: {
      status: "ACTIVE",
      OR: [{ clientId: user.id }, { freelancerId: user.id }],
    },
    include: {
      project: true,
      client: true,
      freelancer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  // Map to frontend-friendly format
  return contracts.map((c) => ({
    contractId: c.id,
    projectName: c.project.title,
    otherUser:
      user.id === c.clientId
        ? {
            id: c.freelancer.id,
            name: c.freelancer.name,
            avatar: c.freelancer.avatar ?? undefined,
          }
        : {
            id: c.client.id,
            name: c.client.name,
            avatar: c.client.avatar ?? undefined,
          },
    lastMessage: null,
  }));
};
