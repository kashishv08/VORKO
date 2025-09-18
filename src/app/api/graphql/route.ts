import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import {typeDefs} from "./typeDef"
import { createUser, loginUser } from "./resolvers/user";
import { clientAllPostedProjects, createProject, getProjectById } from "./resolvers/client";



const resolvers = {
  Query: {
    loginUser,
    clientAllPostedProjects,
    getProjectById,
  },
  Mutation: {
    createUser,
    createProject
  }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

// Typescript: req has the type NextRequest
const handler = startServerAndCreateNextHandler<NextRequest>(server, {
    context: async req => ({ req }),
});

export { handler as GET, handler as POST };