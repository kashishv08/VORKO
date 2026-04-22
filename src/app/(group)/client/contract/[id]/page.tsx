"use client";

import { MARK_PROJ_COMPLETED, PROCESS_PAYMENT } from "@/src/lib/gql/mutation";
import { CONTRACT_BY_ID } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { ContractStatus, User } from "@prisma/client";
import { Spinner } from "@radix-ui/themes";
import { CreditCard, Video, DollarSign, Calendar, ChevronLeft, CheckCircle, FileText, MessageSquare, Shield, ExternalLink, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { contract } from "../page";
import ChatComponent from "@/src/components/chat/ChatComponent";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function ClientContractDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [contract, setContract] = useState<contract>();
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    fetch("/api/currentUser")
      .then((res) => res.json())
      .then((data) => setCurrentUser(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchContract = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res: { contractById: contract } = await gqlClient.request(
          CONTRACT_BY_ID,
          { contractId: id }
        );
        setContract(res?.contractById);
      } catch {
        router.push("/client/contract");
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [id, router]);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res: { processContractPayment: { checkoutUrl: string } } = await gqlClient.request(PROCESS_PAYMENT, { id: contract?.id });
      router.push(`${res.processContractPayment.checkoutUrl}`);
    } catch (err) {
      console.error(err);
      toast.error("Payment initialization failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Skeleton className="h-6 w-32" />
      <div className="bg-white border rounded-xl p-6 space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    </div>
  );

  if (!contract) return null;

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <Link
        href="/client/contract"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Contracts
      </Link>

      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">{contract.project?.title ?? "Contract"}</h1>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              with {contract.freelancer.name}
              {contract.freelancer.role && ` · ${contract.freelancer.role}`}
            </p>
          </div>
          <StatusBadge status={contract.status} size="md" />
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 mb-4">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Contract Amount</p>
            <p className="text-2xl font-bold text-slate-900 flex items-center gap-1.5">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              {contract.project.budget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Started</p>
            <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mt-1">
              <Calendar className="w-4 h-4 text-primary" />
              {new Date(Number(contract.createdAt)).toLocaleDateString()}
            </p>
          </div>
        </div>

        {contract.workSubmitted && (
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              <p className="text-xs font-bold text-slate-900 uppercase">Work Submission</p>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed font-semibold italic mb-3">
              {`"${contract.workDescription}" || "Work has been submitted for review."`}
            </p>
            {contract.deliverableUrl && (
              <a href={contract.deliverableUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
                <ExternalLink className="w-3.5 h-3.5" />
                Review Deliverables
              </a>
            )}
          </div>
        )}

        {/* {contract.status !== "COMPLETED" && (
          <div className="mb-4">
            <Link
              href={`/meeting/${contract.id}`}
              className="inline-flex items-center justify-center w-full gap-2 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors text-sm"
            >
              <Video className="w-4 h-4" />
              Join Meeting Room
            </Link>
          </div>
        )} */}

        {contract.paymentStatus === "PAID" && (
          <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-bold">
            <CheckCircle className="w-4 h-4" />
            Paid successfully
          </div>
        )}

        {contract.workSubmitted && contract.status !== "COMPLETED" && (
          <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={() => setShowConfirmModal(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity text-sm shadow-md"
            >
              <CheckCircle className="w-4 h-4" />
              Approve Work
            </button>
            {/* <button
              onClick={() => setShowChat(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 font-bold rounded-lg hover:bg-slate-50 transition-colors text-sm text-slate-600"
            >
              <MessageSquare className="w-4 h-4" />
              Open Chat
            </button> */}
          </div>
        )}

        {contract.status === "COMPLETED" && contract.paymentStatus !== "PAID" && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-all shadow-lg shadow-primary/20"
            >
              {loading ? <Spinner /> : <CreditCard className="w-4 h-4" />}
              Proceed to Payment
            </button>
          </div>
        )}
      </div>

      <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-tight">Freelancer</h2>
          {/* <button onClick={() => setShowChat(true)} className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
            <MessageSquare className="w-4 h-4" />
          </button> */}
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 rounded-xl border border-slate-100">
            <AvatarImage src={contract.freelancer.avatar || ""} />
            <AvatarFallback className="bg-primary/10 text-primary font-bold">{contract.freelancer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold text-slate-900">{contract.freelancer.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{contract.freelancer.role}</p>
          </div>
        </div>
      </div>

      {/* CHAT PANEL */}
      <AnimatePresence>
        {showChat && currentUser && (
          <div className="fixed inset-0 z-50 flex items-stretch">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowChat(false)} />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative ml-auto w-full max-w-lg bg-white shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <MessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">Collaboration Pad</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{contract.project.title}</p>
                  </div>
                </div>
                <button onClick={() => setShowChat(false)} className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors">
                  <XCircle size={20} className="text-slate-400" />
                </button>
              </div>
              <div className="flex-1 overflow-hidden">
                <ChatComponent
                  user={currentUser}
                  otherUser={currentUser.id === contract.clientId ? contract.freelancer : contract.client}
                  contractId={contract.id}
                  projectName={contract.project.title}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[2rem] p-8 max-w-md w-full border border-slate-100 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3">
                <Shield size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Confirm Work?</h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
                By approving, you acknowledge that all work has been delivered successfully.
              </p>
              <div className="flex gap-4">
                <button onClick={() => setShowConfirmModal(false)} className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-all">
                  No, Wait
                </button>
                <button
                  onClick={async () => {
                    setLoading(true);
                    try {
                      const res: { completeContract: { status: ContractStatus } } = await gqlClient.request(MARK_PROJ_COMPLETED, { id: contract.id });
                      setContract(prev => prev ? { ...prev, status: res.completeContract.status } : undefined);
                      toast.success("Approved!");
                      setShowConfirmModal(false);
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  {loading ? <Spinner /> : "Confirm Approval"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
