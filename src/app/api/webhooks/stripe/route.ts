// src/app/api/webhooks/stripe/route.ts
import Stripe from "stripe";
import { prismaClient } from "@/src/lib/service/prisma";

export const config = {
  api: { bodyParser: false }, // Important for Stripe signature verification
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: Request) {
  console.log("Webhook triggered");

  const buf = Buffer.from(await req.arrayBuffer());
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Webhook signature error:", error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const contractId = paymentIntent.metadata.contractId;

        await prismaClient.contract.update({
          where: { id: contractId },
          data: { paymentStatus: "PAID", status: "COMPLETED" },
        });

        console.log(`Contract ${contractId} marked as PAID.`);
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const contractId = paymentIntent.metadata.contractId;

        await prismaClient.contract.update({
          where: { id: contractId },
          data: { paymentStatus: "FAILED" },
        });

        console.log(`Payment failed for contract ${contractId}.`);
        break;
      }

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (!session.metadata?.contractId) {
          throw new Error("Missing contractId in session metadata");
        }
        const contractId = session.metadata.contractId;

        const contract = await prismaClient.contract.findUnique({
          where: { id: contractId },
        });
        if (!contract) {
          throw new Error("Contract not found");
        }

        await prismaClient.contract.update({
          where: { id: contractId },
          data: {
            paymentStatus: "PAID",
            status: "COMPLETED"
          },
        });

        console.log(
          `Contract ${contractId} marked as PAID via Checkout Session.`
        );
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        if (account.details_submitted) {
          const user = await prismaClient.user.findFirst({
            where: { stripeAccountId: account.id },
          });

          if (user) {
            await prismaClient.user.update({
              where: { id: user.id },
              data: { stripeConnected: true },
            });

            // Update Clerk metadata
            const { clerkClient } = await import("@clerk/nextjs/server");
            const client = await clerkClient();
            if (user?.clerkId) {
              const clerkUser = await client.users.getUser(user.clerkId);
              const publicMetadata = (clerkUser?.publicMetadata ?? {}) as UserPublicMetadata;
              await client.users.updateUser(user.clerkId, {
                publicMetadata: {
                  ...publicMetadata,
                  stripeConnected: true,
                },
              });
            }

            console.log(`User ${user.id} marked as stripeConnected.`);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
