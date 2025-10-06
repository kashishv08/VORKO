import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { typeDefs } from "./typeDef";
import {
  createProject,
  clientAllPostedProjects,
  getProjectById,
  acceptProposal,
  rejectProposal,
  allProposals,
  getClientActiveContracts,
  viewProposal,
  contractById,
} from "./resolvers/client";
import { allClientsProject, submitProposal } from "./resolvers/freelancer";
import { completeOnboarding } from "./resolvers/user";
import { generateChatToken, getUserChats } from "./resolvers/chat";

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
  },
  Mutation: {
    completeOnboarding,
    createProject,
    submitProposal,
    acceptProposal,
    rejectProposal,
    generateChatToken,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req: NextRequest) => {
    return { req };
  },
});

export { handler as GET, handler as POST };
