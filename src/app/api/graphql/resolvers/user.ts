import { clerkClient } from "@/src/lib/service/clerk";
import { prismaClient } from "@/src/lib/service/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const completeOnboarding = async (
  _: unknown,
  args: { skills: string[]; bio: string; role: "CLIENT" | "FREELANCER" }
) => {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated.");

  // console.log(user);

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("User email not found.");

  let dbUser = await prismaClient.user.findUnique({
    where: { clerkId: user.id },
  });
  if (!dbUser) {
    dbUser = await prismaClient.user.create({
      data: {
        clerkId: user.id,
        email,
        name: `${user.firstName} ${user.lastName}`,
        role: args.role,
        onboardingComplete: false,
        password: "",
      },
    });
  }

  // ✅ Update Clerk metadata
  await clerkClient.users.updateUser(user.id, {
    publicMetadata: {
      ...user.publicMetadata,
      onboardingComplete: true,
      bio: args.bio,
      skills: args.skills || [],
    },
  });

  // ✅ Update database
  return prismaClient.user.update({
    where: { clerkId: user.id },
    data: {
      onboardingComplete: true,
      role: args.role,
      bio: args.bio,
      skills: args.skills || [],
    },
  });
};
