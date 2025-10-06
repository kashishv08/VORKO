import { auth } from "@clerk/nextjs/server";
import { prismaClient } from "./service/prisma";

export const getCurrentUserFromDB = async () => {
  const { userId } = await auth();
  if (!userId) return null;

  return prismaClient.user.findUnique({
    where: { clerkId: userId },
  });
};

// export type usertype = {
//   id: string;
//   email: string;
//   name: string;
//   role: Role;
//   bio: string | null;
//   skills: string[];
//   avatar: string | null;
// };

// export const getUserFromCookie = async (): Promise<usertype | null> => {
//   try {
//     const cookie = await cookies();
//     const token = cookie.get("vorkoToken")?.value;
//     if (!token) return null;
//     const data = verifyToken(token);
//     if (!data?.id) {
//       return null;
//     }

//     const user = await prismaClient.user.findUnique({
//       where: { id: data.id },
//       select: {
//         id: true,
//         email: true,
//         name: true,
//         role: true,
//         bio: true,
//         skills: true,
//         avatar: true,
//       },
//     });

//     if (!user) return null;
//     return user;
//   } catch (e: any) {
//     console.log(e);
//     return null;
//   }
// };
