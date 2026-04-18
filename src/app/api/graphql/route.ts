import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
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
};

const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    return { req };
  },
});

export { handler as GET, handler as POST };
