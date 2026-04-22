import { auth, clerkClient } from "@clerk/nextjs/server";
import { prismaClient } from "@/src/lib/service/prisma";
import { NextResponse } from "next/server";
import stripe from "@/src/lib/service/stripe";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prismaClient.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser || !dbUser.stripeAccountId) {
      return NextResponse.json({ connected: false });
    }

    console.log("Checking Stripe status for:", dbUser.stripeAccountId);

    // Check Stripe directly as source of truth
    let account;
    try {
      account = await stripe.accounts.retrieve(dbUser.stripeAccountId);
    } catch (e: unknown) {
      console.warn("Stripe account not found in Stripe:", dbUser.stripeAccountId);
      const err = e as Error;
      return NextResponse.json({ connected: false, error: err.message || "Stripe account not found" });
    }

    console.log("account", account);

    if (account.details_submitted && !dbUser.stripeConnected) {
      console.log("Stripe setup complete. Syncing DB and Clerk...");
      // Sync DB and Clerk if Stripe says it's done but we haven't updated yet
      await prismaClient.user.update({
        where: { id: dbUser.id },
        data: { stripeConnected: true },
      });

      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const publicMetadata = (user.publicMetadata ?? {}) as UserPublicMetadata;
      await client.users.updateUser(userId, {
        publicMetadata: {
          ...publicMetadata,
          stripeConnected: true,
        },
      });

      return NextResponse.json({ connected: true, synced: true });
    }

    const isConnected = dbUser.stripeConnected || account.details_submitted;
    console.log("Final connection status:", isConnected);

    return NextResponse.json({ connected: isConnected });
  } catch (error: unknown) {
    console.error("STRIPE STATUS API ERROR:", error);
    const err = error as Error;
    return NextResponse.json({ error: err.message, connected: false }, { status: 500 });
  }
}
