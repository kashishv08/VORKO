"use client";

import ChatComponent from "@/src/components/chat/ChatComponent";
import { CONTRACT_BY_ID } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { Contract, User } from "@prisma/client";
import { Spinner } from "@radix-ui/themes";
import { CreditCard, MessageSquare, Video, DollarSign, Calendar, ChevronLeft, CheckCircle, FileText, Send, Hourglass, XCircle, Upload } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MARK_PROJ_SUBMIT } from "@/src/lib/gql/mutation";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { contract } from "../../../client/contract/page";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Textarea } from "@/src/components/ui/textarea";
import { Skeleton } from "@/src/components/ui/skeleton";

const schema = z.object({
  workDescription: z.string().min(20, "Please describe your work (min 20 characters)"),
  deliverableUrl: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const statusSteps = ["ACTIVE", "REVIEW_PENDING", "COMPLETED", "PAID"];
const statusLabels: Record<string, string> = {
  ACTIVE: "In Progress",
  REVIEW_PENDING: "Under Review",
  COMPLETED: "Approved",
  PAID: "Paid",
};

export default function FreelancerContractDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [contract, setContract] = useState<contract>();
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [workDescription, setWorkDescription] = useState("");
  const [deliverableUrl, setDeliverableUrl] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { workDescription: "", deliverableUrl: "" },
  });

  const handleSubmit = async () => {
    if (workDescription.length < 20) {
      toast.error("Description must be at least 20 characters");
      return;
    }
    await onSubmit({ workDescription, deliverableUrl });
  };

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
        if (res.contractById.workSubmitted) {
          form.setValue("workDescription", "Work has been submitted for review.");
        }
      } catch {
        router.push("/freelancer/contract");
      } finally {
        setLoading(false);
      }
    };
    fetchContract();
  }, [id, router, form]);

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    try {
      const res: { markWorkSubmitted: contract } = await gqlClient.request(MARK_PROJ_SUBMIT, {
        id,
        workDescription: values.workDescription,
        deliverableUrl: values.deliverableUrl
      });
      setContract((prev: contract | undefined) => (prev ? { ...prev, ...res.markWorkSubmitted } : res.markWorkSubmitted));
      toast.success("Work submitted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit work.");
    } finally {
      setIsSubmitting(false);
    }
  }

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

  const currentStepIndex = statusSteps.indexOf(contract.paymentStatus === 'PAID' ? 'PAID' : contract.status);

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <Link
        href="/freelancer/contract"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to Contracts
      </Link>

      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 leading-tight">{contract.project?.title ?? "Contract"}</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-sm text-slate-500 font-medium">
                Client: {contract.client.name}
              </p>
              {/* <button onClick={() => setShowChat(true)} className="text-slate-400 hover:text-primary transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
              </button> */}
            </div>
          </div>
          <StatusBadge status={contract.status} size="md" />
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-100 mb-5">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your Earnings</p>
            <p className="text-2xl font-bold text-slate-900 flex items-center gap-1.5">
              <DollarSign className="w-5 h-5 text-emerald-500" />
              {contract.project.budget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">StartedOn</p>
            <p className="text-sm font-bold text-slate-700 flex items-center gap-1.5 mt-1">
              <Calendar className="w-4 h-4 text-primary" />
              {new Date(Number(contract.createdAt)).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Progress</p>
          <div className="flex items-center gap-1 px-1 text-center">
            {statusSteps.map((step, i) => (
              <div key={step} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${i <= currentStepIndex ? "bg-primary text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                    {i < currentStepIndex ? "✓" : i + 1}
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 mt-1">{statusLabels[step]}</span>
                </div>
                {i < statusSteps.length - 1 && (
                  <div className={`h-1 flex-1 mx-1 rounded-full mb-4 ${i < currentStepIndex ? "bg-primary" : "bg-slate-100"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {contract.status !== "COMPLETED" && contract.paymentStatus !== "PAID" && (
          <></>
          // <div className="mt-6 pt-5 border-t border-slate-100">
          //   <Link
          //     href={`/meeting/${contract.id}`}
          //     className="inline-flex items-center justify-center w-full gap-2 py-2.5 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors text-sm"
          //   >
          //     <Video className="w-4 h-4" />
          //     Join Meeting Room
          //   </Link>
          // </div>
        )}
      </div>

      {contract.workSubmitted && (
        <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle className="w-4 h-4 text-emerald-500" />
            <h2 className="text-sm font-bold text-slate-900">Work Submitted</h2>
          </div>
          <p className="text-sm text-slate-600 font-medium leading-relaxed italic mb-4">
            {contract.workDescription || "Your deliverables have been submitted for review."}
          </p>
          {contract.deliverableUrl && (
            <a href={contract.deliverableUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline">
              <FileText className="w-3.5 h-3.5" />
              View Deliverable Link
            </a>
          )}
        </div>
      )}

      {contract.status === "ACTIVE" && !contract.workSubmitted && (
        <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-tight">Submit Your Work</h2>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Description</p>
              <Textarea
                placeholder="Briefly describe what you've completed..."
                className="bg-slate-50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary text-sm font-medium leading-relaxed"
                rows={3}
                value={workDescription}
                onChange={(e) => setWorkDescription(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Deliverable Link (Optional)</p>
              <input
                type="url"
                placeholder="https://..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                value={deliverableUrl}
                onChange={(e) => setDeliverableUrl(e.target.value)}
              />
            </div>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white font-bold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20 text-sm"
            >
              {isSubmitting ? <Spinner /> : <Upload className="w-4 h-4" />}
              Mark as Submitted
            </button>
          </div>
        </div>
      )}

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
                    <h3 className="font-bold text-slate-900">Collaboration Space</h3>
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
    </div>
  );
}
