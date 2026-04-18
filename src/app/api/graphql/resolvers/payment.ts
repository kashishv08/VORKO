import { prismaClient } from "@/src/lib/service/prisma";
import stripe from "@/src/lib/service/stripe";

export const processContractPayment = async (
  _: unknown,
  args: { id: string }
) => {
  //   console.log("triggered payment");
  const contract = await prismaClient.contract.findUnique({
    where: { id: args.id },
    include: {
      project: true,
      freelancer: true,
      client: true,
    },
  });

  if (!contract) throw new Error("Contract not found");
  if (!contract.freelancer.stripeAccountId)
    throw new Error("Freelancer does not have a connected Stripe account");
  if (contract.paymentStatus === "PAID")
    throw new Error("Payment already processed");

  const totalAmount = contract.project.budget;
  const platformFee = totalAmount * 0.1;
  const freelancerAmount = totalAmount - platformFee;

  // ✅ Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: contract.project.title,
            description: `Payment for contract ${contract.id}`,
          },
          unit_amount: Math.round(totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      contractId: args.id,
      clientId: contract.clientId,
      freelancerId: contract.freelancerId,
    },
    payment_intent_data: {
      transfer_data: {
        destination: contract.freelancer.stripeAccountId,
      },
    },
    success_url: `https://feuilletonistic-rochelle-inconvincible.ngrok-free.dev/client/payment/success?contractId=${args.id}`,
    cancel_url: `https://feuilletonistic-rochelle-inconvincible.ngrok-free.dev/client/payment/cancelled?contractId=${args.id}`,
  });

  //   console.log("triggered session", session);

  const updated = await prismaClient.contract.update({
    where: { id: args.id },
    data: {
      stripePaymentIntentId: session.payment_intent?.toString() || "",
      paymentStatus: "PENDING",
      amountPaid: totalAmount,
      platformFee,
      freelancerAmount,
      status: "COMPLETED",
      completedAt: session.created ? new Date(session.created * 1000) : null,
    },
    include: {
      project: true,
      client: true,
      freelancer: true,
    },
  });

  //   console.log("triggered updated", updated);

  // Return Checkout URL to frontend
  return { ...updated, checkoutUrl: session.url };
};
