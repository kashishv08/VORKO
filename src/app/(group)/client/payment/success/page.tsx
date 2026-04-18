"use client";

import { useSearchParams } from "next/navigation";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const contractId = searchParams.get("contractId");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold text-green-600 mb-4">
        Payment Successful 🎉
      </h1>
      <p>
        Your payment for contract ID: {contractId} has been processed
        successfully.
      </p>
    </div>
  );
}
