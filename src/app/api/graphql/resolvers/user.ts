import { getCurrentUserFromDB } from "@/src/lib/helper";
import { clerkClient } from "@/src/lib/service/clerk";
import { prismaClient } from "@/src/lib/service/prisma";
import stripe from "@/src/lib/service/stripe";
import { currentUser } from "@clerk/nextjs/server";

export const completeOnboarding = async (
  _: unknown,
  args: { skills: string[]; bio: string; role: "CLIENT" | "FREELANCER" }
) => {
  const user = await currentUser();
  if (!user) throw new Error("User not authenticated.");

  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses?.[0]?.emailAddress;
  if (!email) throw new Error("User email not found.");

  // find or create user
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
        password: "",
      },
    });
  }

  // ✅ If freelancer, create Stripe account
  let stripeAccountId = dbUser.stripeAccountId;
  if (args.role === "FREELANCER" && !stripeAccountId) {
    const account = await stripe.accounts.create({
      type: "express",
      email,
      capabilities: { transfers: { requested: true } },
    });
    stripeAccountId = account.id;
  }

  // ✅ Save updates
  const updatedUser = await prismaClient.user.update({
    where: { clerkId: user.id },
    data: {
      onboardingComplete: true,
      role: args.role,
      bio: args.bio,
      skills: args.skills || [],
      stripeAccountId,
    },
  });

  // ✅ Fetch freshest user to avoid stale metadata overwrites
  const freshUser = await clerkClient.users.getUser(user.id);

  // ✅ Update Clerk metadata
  await clerkClient.users.updateUser(user.id, {
    publicMetadata: {
      ...freshUser.publicMetadata,
      onboardingComplete: true,
      role: args.role,
      bio: args.bio,
      skills: args.skills,
      stripeAccountId,
    },
  });

  // ✅ If freelancer, create an onboarding link
  if (args.role === "FREELANCER" && stripeAccountId) {
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/onboarding/refresh`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/freelancer/dashboard`,
      type: "account_onboarding",
    });

    return {
      ...updatedUser,
      stripeOnboardingUrl: accountLink.url,
    };
  }

  return updatedUser;
};

export const editProfile = async (
  _: unknown,
  args: {
    id: string;
    name: string;
    bio: string;
    skills: string[];
  }
) => {
  try {
    const dbUser = await prismaClient.user.findUnique({
      where: { id: args.id },
    });
    if (!dbUser) throw new Error("User not found in database.");

    const clerkUser = await clerkClient.users.getUser(dbUser.clerkId);
    // console.log(clerkUser);

    const [firstName, ...lastNameParts] = (
      args.name ??
      dbUser.name ??
      ""
    ).split(" ");
    const lastName = lastNameParts.join(" ");

    await clerkClient.users.updateUser(dbUser.clerkId, {
      firstName: (args.name ? firstName : clerkUser.firstName) ?? undefined,
      lastName: (args.name ? lastName : clerkUser.lastName) ?? undefined,
      publicMetadata: {
        ...clerkUser.publicMetadata,
        bio: args.bio ? args.bio : clerkUser.publicMetadata.bio,
        skills: args.skills
          ? args.skills
          : clerkUser.publicMetadata.skills ?? null,
        role: clerkUser.unsafeMetadata.role,
      },
    });

    const updatedUser = await prismaClient.user.update({
      where: { id: args.id },
      data: {
        name: args.name ? args.name : dbUser.name,
        bio: args.bio ? args.bio : dbUser.bio,
        skills: args.skills ? args.skills : dbUser.skills,
      },
    });

    return updatedUser;
  } catch (err) {
    console.error("EditProfile error:", err);
    throw new Error("Failed to update profile.");
  }
};
