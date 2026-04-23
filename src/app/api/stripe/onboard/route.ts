export const dynamic = "force-dynamic";
import { auth } from "@clerk/nextjs/server";
import { prismaClient } from "@/src/lib/service/prisma";
import stripe from "@/src/lib/service/stripe";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const dbUser = await prismaClient.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser || !dbUser.stripeAccountId) {
      return NextResponse.json({ error: "Stripe account not found" }, { status: 404 });
    }

    const accountLink = await stripe.accountLinks.create({
      account: dbUser.stripeAccountId,
      refresh_url: `${process.env.NEXT_PUBLIC_BASE_URL}/freelancer/onboarding/stripe`,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/freelancer/dashboard?synced=true`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: unknown) {
    console.error("STRIPE ONBOARD API ERROR:", error);
    const err = error as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
