// resolvers/chat.ts
import { prismaClient } from "@/src/lib/service/prisma";
import { auth } from "@clerk/nextjs/server";
import { StreamChat } from "stream-chat";

const getServerClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY!;
  const apiSecret = process.env.STREAM_API_SECRET!;
  if (!apiKey || !apiSecret) {
    throw new Error("Stream API key or secret is missing.");
  }
  return StreamChat.getInstance(apiKey, apiSecret);
};

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
      status: { in: ["ACTIVE", "COMPLETED", "REVIEW_PENDING"] },
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

export const getRecentMessages = async () => {
  const user = await getCurrentUserFromDB();
  if (!user) throw new Error("Not authenticated");

  const contracts = await prismaClient.contract.findMany({
    where: {
      OR: [{ clientId: user.id }, { freelancerId: user.id }],
    },
    include: {
      project: true,
      client: true,
      freelancer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const results = [];

  for (const contract of contracts) {
    const otherUser =
      user.id === contract.clientId ? contract.freelancer : contract.client;

    interface ChatChannelData {
      name: string;
      members: string[];
      created_by_id: string;
    }

    const serverClient = getServerClient();
    const channel = serverClient.channel("messaging", contract.id, {
      name: `Chat for ${contract.project.title}`,
      members: [user.id, otherUser.id],
      created_by_id: user.id,
    } as ChatChannelData);

    await channel.watch();

    // 4️⃣ Get the most recent message
    const lastMessage = channel.state.messages.at(-1);

    results.push({
      contractId: contract.id,
      projectName: contract.project.title,
      otherUser: {
        id: otherUser.id,
        name: otherUser.name,
        avatar: otherUser.avatar,
      },
      lastMessageId: lastMessage?.id || null,
      lastMessageText: lastMessage?.text || null,
      lastMessageSender: lastMessage?.user?.name || null,
      lastMessageCreatedAt: lastMessage?.created_at || null,
      lastMessage: lastMessage?.text || null, // for backward compatibility
    });
  }

  // 5️⃣ Sort descending by last message timestamp
  results.sort(
    (a, b) =>
      new Date(b.lastMessageCreatedAt || 0).getTime() -
      new Date(a.lastMessageCreatedAt || 0).getTime()
  );

  return results;
};
