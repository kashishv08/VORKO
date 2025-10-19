import { auth, currentUser } from "@clerk/nextjs/server";
import { prismaClient } from "@/src/lib/service/prisma";
import { StreamChat } from "stream-chat";
// const streamClient = StreamChat.getInstance(
//   process.env.NEXT_PUBLIC_STREAM_API_KEY!,
//   process.env.STREAM_SECRET!
// );

// Helper to fetch your app's user by current session Clerk ID
async function getCurrentUserFromDB() {
  const { userId } = await auth();
  // console.log("gql wala userid", userId);
  if (!userId) return null;
  return await prismaClient.user.findUnique({ where: { clerkId: userId } });
}

export const allClientsProject = async () => {
  const proj = await prismaClient.project.findMany({
    include: {
      client: true,
    },
  });
  // console.log(proj);
  if (proj) {
    return proj;
  } else {
    return [];
  }
};

export const submitProposal = async (
  _: unknown,
  args: {
    amount: number;
    coverLetter: string;
    projectId: string;
  }
) => {
  const user = await getCurrentUserFromDB();
  if (!user) {
    return null;
  }

  if (user.role !== "FREELANCER") return null;

  // Only allow submitting if proposal doesn't already exist for this user+project
  const existing = await prismaClient.proposal.findFirst({
    where: {
      freelancerId: user.id, // use your DB user.id (not clerkId!)
      projectId: args.projectId,
    },
  });

  if (existing) {
    throw new Error("You have already submitted a proposal for this project.");
  }

  const proposal = await prismaClient.proposal.create({
    data: {
      amount: args.amount,
      coverLetter: args.coverLetter,
      freelancerId: user.id, // use your DB user.id for relation
      projectId: args.projectId,
    },
    include: {
      freelancer: true,
      project: true,
    },
  });

  return proposal;
};

export const getFreelancerActiveContracts = async () => {
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  const dbUser = await prismaClient.user.findUnique({
    where: { clerkId: user.id },
  });

  // console.log(dbUser);

  if (!dbUser) {
    throw new Error("User not found in database");
  }

  const contracts = await prismaClient.contract.findMany({
    where: {
      status: "ACTIVE",
      freelancerId: dbUser.id,
    },
    include: {
      project: true,
      client: true,
      freelancer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return contracts;
};

// export const deliverWork = async (
//   _: unknown,
//   args: { contractId: string; submissionLink: string }
// ) => {
//   const contract = await prismaClient.contract.update({
//     where: { id: args.contractId },
//     data: {
//       status: "REVIEW_PENDING",
//       workSubmitted: true,
//       submissionLink: args.submissionLink,
//     },
//     include: { client: true, freelancer: true },
//   });

//   const channel = streamClient.channel("messaging", args.contractId);
//   await channel.sendMessage({
//     text: `Freelancer delivered the project for review.\n[View Submission](${args.submissionLink})`,
//     user_id: contract.freelancer.id,
//     type: "system",
//   });

//   return contract;
// };
