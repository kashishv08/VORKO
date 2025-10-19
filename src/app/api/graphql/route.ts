import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { generateChatToken, getUserChats } from "./resolvers/chat";
import {
  acceptProposal,
  allProposals,
  clientAllPostedProjects,
  clientDashboard,
  contractById,
  createProject,
  getClientActiveContracts,
  getProjectById,
  rejectProposal,
  viewProposal,
} from "./resolvers/client";
import {
  allClientsProject,
  getFreelancerActiveContracts,
  submitProposal,
} from "./resolvers/freelancer";
import { completeOnboarding } from "./resolvers/user";
import { typeDefs } from "./typeDef";

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
  },
  Mutation: {
    completeOnboarding,
    createProject,
    submitProposal,
    acceptProposal,
    rejectProposal,
    generateChatToken,
    // approveWork,
    // deliverWork,
    // requestRevision,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    return { req };
  },
});

export { handler as GET, handler as POST };
