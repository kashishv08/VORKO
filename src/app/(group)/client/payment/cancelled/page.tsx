"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { XCircle, RefreshCw, AlertCircle, Home, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Suspense } from "react";

function PaymentCancelledContent() {
  const searchParams = useSearchParams();
  const contractId = searchParams.get("contractId");
  const router = useRouter();

  return (
    <div className="max-w-xl mx-auto py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-border rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full -mr-16 -mt-16" />

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-24 h-24 rounded-3xl bg-red-50 flex items-center justify-center mx-auto mb-8 shadow-inner border border-red-100/50"
        >
          <XCircle className="w-12 h-12 text-red-500" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Payment Cancelled</h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed mb-10 max-w-sm mx-auto">
            The transaction for your contract was not completed. No funds have been deducted from your account.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-amber-50 rounded-2xl p-5 mb-10 flex items-center gap-4 border border-amber-100 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <p className="text-xs font-black text-amber-600 uppercase tracking-widest mb-0.5">Note</p>
            <p className="text-amber-800 text-xs font-bold leading-relaxed">
              If this was a mistake, you can re-initiate the payment from the contract workspace.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <button
            onClick={() => router.push(`/client/contract/${contractId}`)}
            className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-8 bg-slate-900 text-white font-bold rounded-2xl hover:bg-primary transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary/20 transform active:scale-95 group"
          >
            <RefreshCw size={18} className="group-hover:rotate-180 transition-transform duration-700" />
            Retry Payment
          </button>
          <Link
            href="/client/dashboard"
            className="flex-1 inline-flex items-center justify-center gap-2 py-4 px-8 border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all transform active:scale-95"
          >
            <Home size={18} />
            Return Home
          </Link>
        </motion.div>

        <div className="mt-10 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
          <ShieldAlert size={12} className="text-red-400" />
          Transaction Aborted
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentCancelled() {
  return (
    <Suspense fallback={null}>
      <PaymentCancelledContent />
    </Suspense>
  );
}
