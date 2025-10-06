import { clerkClient } from "@/src/lib/service/clerk";
import { prismaClient } from "@/src/lib/service/prisma";
import { currentUser } from "@clerk/nextjs/server";

export const completeOnboarding = async (
  _: unknown,
  args: {
    skills: string[];
    bio: string;
  }
) => {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated.");

  const role =
    (user.publicMetadata?.role as "FREELANCER" | "CLIENT") ?? "CLIENT";

  await clerkClient.users.updateUser(user.id, {
    publicMetadata: {
      onboardingComplete: true,
      role,
      bio: args.bio,
      skills: args.skills || [],
    },
  });

  const updated = await prismaClient.user.update({
    where: { clerkId: user.id },
    data: {
      onboardingComplete: true,
      role,
      bio: args.bio,
      skills: args.skills || [],
    },
    include: {
      projects: true,
      proposals: true,
    },
  });

  return updated;
};
