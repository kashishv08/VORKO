import { auth } from "@clerk/nextjs/server";
import { prismaClient } from "@/src/lib/service/prisma";

// Helper to fetch your app's user by current session Clerk ID
async function getCurrentUserFromDB() {
  const { userId } = await auth();
  console.log("gql wala userid", userId);
  if (!userId) return null;
  return await prismaClient.user.findUnique({ where: { clerkId: userId } });
}

export const allClientsProject = async () => {
  const proj = await prismaClient.project.findMany({
    include: {
      client: true,
    },
  });
  console.log(proj);
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
