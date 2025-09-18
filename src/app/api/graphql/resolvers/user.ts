import { RoleType } from "@/generated/prisma";
import { generateToken } from "@/src/lib/service/jwt";
import { prismaClient } from "@/src/lib/service/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const createUser = async (
  _: any,
  args: {
    name: string;
    email: string;
    password: string;
    role: RoleType;
  }
) => {
  const cookie = await cookies();
  const isUser = await prismaClient.user.findUnique({
    where: {
      email: args.email,
    },
  });
  if (isUser) {
    return false;
  }

  const hashedPassword = await bcrypt.hash(args.password, 10);
  const user = await prismaClient.user.create({
    data: {
      name: args.name,
      email: args.email,
      role: args.role,
      password: hashedPassword,
    },
  });

  const token = generateToken({
    id: user.id,
  });
  cookie.set("vorkoToken", token);
  return true;
};

export const loginUser = async (
  _: any,
  args: {
    email: string;
    password: string;
  }
) => {
  const cookie = await cookies();
  const user = await prismaClient.user.findUnique({
    where: {
      email: args.email,
    },
  });
  if (!user) return false;
  const pwdCorrect = bcrypt.compare(args.password, user.password);
  if (!pwdCorrect) return false;
  const token = generateToken({ id: user.id });
  cookie.set("vorkoToken", token);
  return true;
};
