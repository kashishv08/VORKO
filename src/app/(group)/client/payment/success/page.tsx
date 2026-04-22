"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense } from "react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const contractId = searchParams.get("contractId");

  return (
    <div className="max-w-md mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-border rounded-2xl p-10 text-center shadow-sm"
      >
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h1>
        <p className="text-slate-500 text-sm leading-relaxed mb-8">
          Your payment has been processed. The freelancer has been notified and the contract is now marked as paid.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/client/contract"
            className="inline-flex items-center justify-center gap-2 py-2.5 px-6 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
          >
            View Contracts
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/client/dashboard"
            className="inline-flex items-center justify-center py-2.5 px-6 border border-border rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors text-slate-600"
          >
            Go to Dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense fallback={null}>
      <PaymentSuccessContent />
    </Suspense>
  );
}
