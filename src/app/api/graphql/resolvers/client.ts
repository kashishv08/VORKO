import { getCurrentUserFromDB } from "@/src/lib/helper";
import { prismaClient } from "@/src/lib/service/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { StreamChat } from "stream-chat";

// const streamClient = StreamChat.getInstance(
//   process.env.NEXT_PUBLIC_STREAM_API_KEY!,
//   process.env.STREAM_SECRET!
// );

export const createProject = async (
  _: unknown,
  args: {
    title: string;
    description: string;
    budget: number;
    deadline: string;
  }
) => {
  const user = await getCurrentUserFromDB();
  // console.log(user);

  if (!user || user.role !== "CLIENT") {
    return { data: "only client create the project" };
  }

  const proj = await prismaClient.project.create({
    data: {
      title: args.title,
      description: args.description,
      budget: args.budget,
      deadline: new Date(args.deadline),
      clientId: user.id,
    },
    include: { client: true },
  });

  return proj;
};

export const clientAllPostedProjects = async (
  _: unknown,
  args: { id: string }
) => {
  const dbUser = await prismaClient.user.findUnique({
    where: { clerkId: args.id },
  });
  if (!dbUser) throw new Error("User not found in database for given Clerk ID");

  const proj = await prismaClient.project.findMany({
    where: { clientId: dbUser.id },
    include: { client: true, proposals: true, contract: true },
  });
  return proj;
};

export const getProjectById = async (_: unknown, args: { id: string }) => {
  const proj = await prismaClient.project.findUnique({
    where: { id: args.id },
    include: {
      client: true,
      proposals: {
        include: {
          freelancer: true,
        },
      },
      contract: true,
    },
  });
  return proj;
};

// Example for delProject (uncomment & complete if needed)
// export const delProject = async (_: any, args: { id: string }) => {
//   const user = await getCurrentUserFromDB();
//   if (!user || user.role !== "CLIENT") return { error: "Unauthorized" };
//   // Add delete logic here...
// };

// View all proposals for a project the client owns
export const viewProposal = async (_: unknown, args: { projectId: string }) => {
  const user = await getCurrentUserFromDB();
  if (!user || user.role !== "CLIENT") return [];

  const project = await prismaClient.project.findUnique({
    where: { id: args.projectId },
  });
  if (!project || project.clientId.toString() !== user.id.toString()) return [];

  return prismaClient.proposal.findMany({
    where: { projectId: args.projectId },
    include: { freelancer: true, project: true },
  });
};

export const allProposals = async () => {
  const user = await getCurrentUserFromDB();
  if (!user) return [];

  return prismaClient.proposal.findMany({
    where: { project: { clientId: user.id } },
    include: {
      freelancer: true,
      project: { include: { client: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export async function acceptProposal(_: unknown, args: { proposalId: string }) {
  const proposal = await prismaClient.proposal.update({
    where: { id: args.proposalId },
    data: { status: "ACCEPTED" },
    include: { project: true, freelancer: true },
  });

  console.log("proposal", proposal);

  await prismaClient.proposal.updateMany({
    where: {
      projectId: proposal.projectId,
      id: { not: proposal.id },
    },
    data: { status: "REJECTED" },
  });

  const contract = await prismaClient.contract.create({
    data: {
      projectId: proposal.projectId,
      clientId: proposal.project.clientId,
      freelancerId: proposal.freelancerId,
      status: "ACTIVE",
    },
    include: { freelancer: true, project: true, client: true },
  });

  console.log("contract", contract);

  const serverClient = StreamChat.getInstance(
    process.env.NEXT_PUBLIC_STREAM_API_KEY!,
    process.env.STREAM_API_SECRET!
  );

  await serverClient.upsertUser({
    id: contract.clientId,
    name: contract.client.name,
    image: contract.client.avatar ?? undefined,
  });

  await serverClient.upsertUser({
    id: contract.freelancerId,
    name: contract.freelancer.name,
    image: contract.freelancer.avatar ?? undefined,
  });

  // 🔹 Update project status
  await prismaClient.project.update({
    where: { id: proposal.projectId },
    data: {
      status: "HIRED",
      contract: { connect: { id: contract.id } },
      budget: proposal.amount,
    },
  });

  return proposal;
}

export async function rejectProposal(_: unknown, args: { proposalId: string }) {
  const proposal = await prismaClient.proposal.update({
    where: { id: args.proposalId },
    data: { status: "REJECTED" },
    include: { project: true, freelancer: true },
  });

  return proposal;
}

export const getClientActiveContracts = async () => {
  const user = await currentUser();
  // console.log(user);

  if (!user) {
    throw new Error("User not authenticated");
  }

  const dbUser = await prismaClient.user.findUnique({
    where: { clerkId: user.id },
  });

  // console.log(dbUser);

  if (!dbUser) {
    throw new Error("User not found in database");
  }

  const activeContracts = await prismaClient.contract.findMany({
    where: {
      clientId: dbUser.id,
    },
    include: {
      project: true,
      freelancer: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return activeContracts;
};

export async function contractById(_: unknown, args: { contractId: string }) {
  const contract = await prismaClient.contract.findUnique({
    where: { id: args.contractId },
    include: {
      project: { include: { proposals: true } },
      freelancer: true,
      client: true,
    },
  });
  if (!contract) return null;

  const acceptedProposal = contract.project.proposals.find(
    (proposal) =>
      proposal.freelancerId === contract.freelancerId &&
      proposal.status === "ACCEPTED"
  );

  return {
    ...contract,
    acceptedProposal,
  };
}

export async function cancelContract(_: unknown, args: { contractId: string }) {
  return await prismaClient.contract.update({
    where: { id: args.contractId },
    data: {
      status: "CANCELLED",
      completedAt: new Date(),
    },
  });
}

export const clientDashboard = async () => {
  const user = await getCurrentUserFromDB();
  console.log(user);
  if (!user) throw new Error("Unauthorized");

  const proposalsPendingCount = await prismaClient.proposal.count({
    where: {
      project: { clientId: user.id },
      status: "SUBMITTED",
    },
  });

  const activeContractsCount = await prismaClient.contract.count({
    where: {
      clientId: user.id,
      status: {
        in: ["ACTIVE", "REVIEW_PENDING"],
      },
    },
  });

  const activeProjects = await prismaClient.project.findMany({
    where: { clientId: user.id },
    include: { proposals: true, contract: true },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const completedContracts = await prismaClient.contract.findMany({
    where: {
      clientId: user.id,
      status: "COMPLETED",
    },
  });

  // console.log(completedContracts);

  const totalspent = completedContracts.reduce(
    (sum, contract) => sum + (contract.amountPaid || 0),
    0
  );

  return {
    activeProjects,
    activeContractsCount,
    proposalsPendingCount,
    totalspent,
  };
};

export const completeContract = async (_: unknown, args: { id: string }) => {
  const user = await getCurrentUserFromDB();
  if (user?.role != "CLIENT") return;
  return prismaClient.contract.update({
    where: { id: args.id },
    data: { status: "COMPLETED" },
  });
};

export const earningsGraph = async () => {
  const contracts = await prismaClient.contract.findMany({
    where: { paymentStatus: "PAID", completedAt: { not: null } },
    select: {
      completedAt: true,
      project: {
        select: { budget: true },
      },
    },
  });

  // group by month in JS
  const grouped: Record<string, number> = {};

  contracts.forEach((c) => {
    const month = c.completedAt!.toISOString().slice(0, 7);
    grouped[month] = (grouped[month] || 0) + c.project.budget;
  });

  return Object.entries(grouped)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => a.month.localeCompare(b.month));
};
