import { getCurrentUserFromDB } from "@/src/lib/helper";
import { prismaClient } from "@/src/lib/service/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { StreamChat } from "stream-chat";
import { type Prisma } from "@prisma/client";

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

  const activeProjectsCount = await prismaClient.project.count({
    where: { clientId: user.id, status: "OPEN" }
  });

  const allProjects = await prismaClient.project.findMany({
    where: { clientId: user.id },
    include: { proposals: true, contract: true },
    orderBy: [
      { status: 'asc' }, // This might not work as intended for custom sort, I'll handling sorting in code or use multiple queries if needed.
      { createdAt: 'desc' }
    ],
    take: 10,
  });

  // Since prisma sort on enum might be alphabetically, I'll do a simple JS sort to put OPEN first
  const activeProjects = allProjects.sort((a, b) => {
    if (a.status === 'OPEN' && b.status !== 'OPEN') return -1;
    if (a.status !== 'OPEN' && b.status === 'OPEN') return 1;
    return 0;
  }).slice(0, 5);

  const allSpentContracts = await prismaClient.contract.findMany({
    where: {
      clientId: user.id,
      paymentStatus: "PAID",
    },
    select: {
      amountPaid: true,
      completedAt: true,
    },
  });

  const totalspent = allSpentContracts.reduce(
    (sum, contract) => sum + (contract.amountPaid || 0),
    0
  );

  // Group by month for analytics (last 6 months)
  const grouped: Record<string, number> = {};
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    return d.toISOString().slice(0, 7);
  }).reverse();

  last6Months.forEach(m => grouped[m] = 0);

  allSpentContracts.forEach((c) => {
    if (c.completedAt) {
      const month = c.completedAt.toISOString().slice(0, 7);
      if (grouped[month] !== undefined) {
        grouped[month] += c.amountPaid || 0;
      }
    }
  });

  const analytics = Object.entries(grouped)
    .map(([month, total]) => {
      const monthName = new Date(month + "-01").toLocaleString('default', { month: 'short' });
      return { month: monthName, total };
    })
    .sort((a, b) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });

  return {
    activeProjects,
    activeProjectsCount,
    activeContractsCount,
    proposalsPendingCount,
    totalspent,
    analytics
  };
};

export const completeContract = async (_: unknown, args: { id: string }) => {
  const user = await getCurrentUserFromDB();
  if (user?.role != "CLIENT") return;
  const contract = await prismaClient.contract.update({
    where: { id: args.id },
    data: { status: "COMPLETED", completedAt: new Date() },
  });

  await prismaClient.project.update({
    where: { id: contract.projectId },
    data: { status: "CLOSED" }
  });

  return contract;
};

export const earningsGraph = async () => {
  const user = await getCurrentUserFromDB();
  if (!user) throw new Error("Unauthorized");

  const where: Prisma.ContractWhereInput = {
    paymentStatus: "PAID",
    completedAt: { not: null }
  };

  if (user.role === "FREELANCER") {
    where.freelancerId = user.id;
  } else {
    where.clientId = user.id;
  }

  const contracts = await prismaClient.contract.findMany({
    where,
    select: {
      completedAt: true,
      amountPaid: true,
      freelancerAmount: true,
    },
  });

  const grouped: Record<string, number> = {};

  contracts.forEach((c) => {
    const month = c.completedAt!.toISOString().slice(0, 7);
    const amount = user.role === "FREELANCER" ? (c.freelancerAmount || 0) : (c.amountPaid || 0);
    grouped[month] = (grouped[month] || 0) + amount;
  });

  return Object.entries(grouped)
    .map(([month, total]) => {
      const monthName = new Date(month + "-01").toLocaleString('default', { month: 'short' });
      return { month: monthName, total };
    })
    .sort((a, b) => {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return months.indexOf(a.month) - months.indexOf(b.month);
    });
};
