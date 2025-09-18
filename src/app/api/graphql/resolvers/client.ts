import { getUserFromCookie } from "@/src/lib/helper";
import { prismaClient } from "@/src/lib/service/prisma";

export const createProject = async (
  _: any,
  args: {
    title: string;
    description: string;
    budget: number;
    deadline: string;
  }
) => {
  const user = await getUserFromCookie();

  if (!user || user.role !== "CLIENT") {
    return {
      data: "only client create the project",
    };
  }

  const proj = await prismaClient.project.create({
    data: {
      title: args.title,
      description: args.description,
      budget: args.budget,
      deadline: new Date(args.deadline),
      clientId: user.id,
    },
    include: {
      client: true,
    },
  });

  return proj;
};

export const clientAllPostedProjects = async (
  _: any,
  args: {
    id: string;
  }
) => {
  const proj = await prismaClient.project.findMany({
    where: {
      clientId: args.id,
    },
    include: {
      client: true,
    },
  });
  return proj;
};

export const getProjectById = async (
  _: any,
  args: {
    id: string;
  }
) => {
  const proj = await prismaClient.project.findUnique({
    where: {
      id: args.id,
    },
    include: {
      client: true,
      proposals: true,
      contract: true,
    },
  });
  return proj;
};
