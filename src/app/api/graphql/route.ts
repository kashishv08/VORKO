import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { prismaClient } from "@/src/lib/service/prisma";
import { User } from "@prisma/client";
import {
  generateChatToken,
  getRecentMessages,
  getUserChats,
} from "./resolvers/chat";
import {
  acceptProposal,
  allProposals,
  clientAllPostedProjects,
  clientDashboard,
  completeContract,
  contractById,
  createProject,
  earningsGraph,
  getClientActiveContracts,
  getProjectById,
  rejectProposal,
  viewProposal,
} from "./resolvers/client";
import {
  allClientsProject,
  freelancerDashboard,
  getFreelancerActiveContracts,
  markWorkSubmitted,
  submitProposal,
} from "./resolvers/freelancer";
import { completeOnboarding, editProfile } from "./resolvers/user";
import { typeDefs } from "./typeDef";
import { processContractPayment } from "./resolvers/payment";

const resolvers = {
  Query: {
    clientAllPostedProjects,
    getProjectById,
    allClientsProject,
    viewProposal,
    allProposals,
    getClientActiveContracts,
    contractById,
    getUserChats,
    getFreelancerActiveContracts,
    clientDashboard,
    freelancerDashboard,
    earningsGraph,
    getRecentMessages,
  },
  Mutation: {
    completeOnboarding,
    createProject,
    submitProposal,
    acceptProposal,
    rejectProposal,
    generateChatToken,
    editProfile,
    completeContract,
    markWorkSubmitted,
    processContractPayment,
  },
  User: {
    totalProjects: async (parent: User) => {
      return await prismaClient.project.count({ where: { clientId: parent.id } });
    },
    hiringRate: async (parent: User) => {
      const total = await prismaClient.project.count({ where: { clientId: parent.id } });
      if (total === 0) return 0;
      const hired = await prismaClient.project.count({ 
        where: { 
          clientId: parent.id,
          status: { in: ["HIRED", "CLOSED"] }
        } 
      });
      return Math.round((hired / total) * 100);
    },
    projects: async (parent: User) => {
      return await prismaClient.project.findMany({ where: { clientId: parent.id } });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    return { req };
  },
});

export async function GET(request: NextRequest) {
  return handler(request);
}

export async function POST(request: NextRequest) {
  return handler(request);
}
