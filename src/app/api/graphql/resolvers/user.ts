import { clerkClient } from "@/src/lib/service/clerk";
import { prismaClient } from "@/src/lib/service/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const completeOnboarding = async (
  _: unknown,
  args: { skills: string[]; bio: string; role: "CLIENT" | "FREELANCER" }
) => {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated.");

  const email =
    user.primaryEmailAddress?.emailAddress ||
    user.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("User email not found.");

  // check for existing user in DB by clerkId
  let dbUser = await prismaClient.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) {
    // This might happen if webhook didn't create it
    dbUser = await prismaClient.user.create({
      data: {
        clerkId: user.id,
        email,
        name: user.firstName + " " + user.lastName,
        role: args.role,
        onboardingComplete: false, // will be updated below
        password: "",
      },
    });
  }

  // Update Clerk metadata
  await clerkClient.users.updateUser(user.id, {
    publicMetadata: {
      onboardingComplete: true,
      role: args.role,
      bio: args.bio,
      skills: args.skills || [],
    },
  });

  // Update DB user
  const updated = await prismaClient.user.update({
    where: { clerkId: user.id },
    data: {
      onboardingComplete: true,
      role: args.role,
      bio: args.bio,
      skills: args.skills || [],
    },
  });

  return updated;
};
