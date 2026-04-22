"use client";

import { CREATE_PROPOSAL } from "@/src/lib/gql/mutation";
import { GET_ONE_PROJECT } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { Project, User } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { 
  DollarSign, 
  Calendar, 
  Users, 
  ChevronLeft, 
  CheckCircle,
  Hourglass,
  XCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/src/components/ui/skeleton";

const schema = z.object({
  bidAmount: z.coerce.number().min(1, "Bid amount must be greater than 0"),
  coverLetter: z.string().min(50, "Please write at least 50 characters"),
  estimatedDuration: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

type ProjWithClient = Project & {
  client: User;
  proposals: {
    id: string;
    coverLetter: string;
    amount: number;
    status: "SUBMITTED" | "ACCEPTED" | "REJECTED";
    freelancer: { id: string; name: string; avatar?: string; clerkId: string };
  }[];
};

export default function FreelancerProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [project, setProject] = useState<ProjWithClient>();
  const [loading, setLoading] = useState(true);
  const [proposalStatus, setProposalStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(schema) as Resolver<FormData>,
    defaultValues: { bidAmount: 0, coverLetter: "", estimatedDuration: "" },
  });

  useEffect(() => {
    if (!id || !isLoaded || !user) return;

    const fetchProj = async () => {
      try {
        const data: { getProjectById: ProjWithClient } = await gqlClient.request(GET_ONE_PROJECT, { id });
        setProject(data.getProjectById);
        const existingProposal = data.getProjectById.proposals.find(p => p.freelancer?.clerkId === user.id);
        if (existingProposal) {
          setProposalStatus(existingProposal.status);
          form.reset({
            bidAmount: existingProposal.amount,
            coverLetter: existingProposal.coverLetter,
          });
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProj();
  }, [id, user, isLoaded, form]);

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    try {
      await gqlClient.request(CREATE_PROPOSAL, {
        amount: Number(values.bidAmount),
        coverLetter: values.coverLetter,
        projectId: id,
      });
      setProposalStatus("SUBMITTED");
      toast.success("Proposal submitted successfully!");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit proposal. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-6 w-32 bg-slate-100 rounded animate-pulse" />
          <div className="bg-white border rounded-xl p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
          </div>
        </div>
        <div className="space-y-4">
           <Skeleton className="h-96 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="grid lg:grid-cols-3 gap-6 max-w-6xl mx-auto pb-12">
      <div className="lg:col-span-2 space-y-6">
        <Link 
          href="/freelancer/project" 
          className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Job Feed
        </Link>

        {/* Status Banner */}
        {proposalStatus && (
          <div className={`p-4 rounded-xl border flex items-center gap-4 ${
            proposalStatus === "SUBMITTED" ? "bg-amber-50 border-amber-100 text-amber-700" :
            proposalStatus === "ACCEPTED" ? "bg-emerald-50 border-emerald-100 text-emerald-700" :
            "bg-red-50 border-red-100 text-red-700"
          }`}>
             {proposalStatus === "SUBMITTED" && <Hourglass size={20} className="animate-pulse" />}
             {proposalStatus === "ACCEPTED" && <CheckCircle size={20} />}
             {proposalStatus === "REJECTED" && <XCircle size={20} />}
             <div className="flex-1">
                <p className="font-bold text-sm">
                    {proposalStatus === "SUBMITTED" && "Proposal Pending Review"}
                    {proposalStatus === "ACCEPTED" && "Congratulations! You've been hired!"}
                    {proposalStatus === "REJECTED" && "Application Unsuccessful"}
                </p>
             </div>
             {proposalStatus === "ACCEPTED" && (
                <Link href="/freelancer/contract" className="bg-emerald-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-emerald-700 transition-all">
                    View Contract
                </Link>
             )}
          </div>
        )}

        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-xl font-bold text-slate-900">{project.title}</h1>
            <StatusBadge status={project.status} size="md" />
          </div>

          <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-400 uppercase tracking-tight mb-6 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span className="text-base font-black text-slate-900 normal-case tracking-normal">${project.budget.toLocaleString()}</span>
              <span>budget</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Due {new Date(Number(project.deadline)).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-400" />
              <span>{project.proposals.length} proposal{project.proposals.length !== 1 ? "s" : ""}</span>
            </div>
          </div>

          <div className="prose prose-sm max-w-none mb-8">
            <p className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">{project.description}</p>
          </div>

          {/* Client Info Section */}
          <div className="pt-6 border-t border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">About the Client</p>
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 rounded-xl border border-slate-100">
                <AvatarImage src={project.client.avatar || ""} />
                <AvatarFallback className="bg-slate-50 text-slate-400 font-bold">{project.client.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-slate-900">{project.client.name}</p>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-tight">
                    <span className="text-primary">Verified Client</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <Clock size={12} />
                        Joined {new Date(Number(project.createdAt)).getFullYear()}
                    </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {proposalStatus === "SUBMITTED" || proposalStatus === "ACCEPTED" || proposalStatus === "REJECTED" ? (
          <div className="bg-white border border-border rounded-xl p-6 text-center shadow-sm">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${
                proposalStatus === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-600' : 
                proposalStatus === 'REJECTED' ? 'bg-red-100 text-red-600' : 'bg-slate-100 text-slate-600'
            }`}>
              {proposalStatus === 'ACCEPTED' ? <CheckCircle size={24} /> : 
               proposalStatus === 'REJECTED' ? <XCircle size={24} /> : <Clock size={24} />}
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Proposal Status: {proposalStatus}</h3>
            <p className="text-sm text-slate-500 mb-6 font-medium leading-relaxed">
                {proposalStatus === 'SUBMITTED' ? "Your proposal is being reviewed by the client. You'll be notified of any updates." :
                 proposalStatus === 'ACCEPTED' ? "The client has accepted your proposal! You can now start working on the project." :
                 "The client has chosen another freelancer for this role. Better luck next time!"}
            </p>
            <Link href="/freelancer/project" className="text-sm text-primary font-bold hover:underline">
              Browse more projects
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-900 mb-5">Submit a Proposal</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="bidAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Your Bid (USD)</FormLabel>
                      <FormControl>
                        <div className="relative group">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold group-focus-within:text-primary transition-colors">$</span>
                          <Input 
                            type="number" 
                            className="pl-7 bg-slate-50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary font-bold" 
                            placeholder="5000" 
                            {...field} 
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="coverLetter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1 text-slate-400 font-bold">Cover Letter</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell the client why you're the perfect fit for this project..."
                          className="bg-slate-50 border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary min-h-[150px] leading-relaxed font-medium"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-xs font-bold" />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  disabled={isSubmitting || project?.status !== "OPEN"}
                  className="w-full py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Submitting..." : "Submit Proposal"}
                </button>
              </form>
            </Form>
          </div>
        )}
        
        {/* Safe Payment Banner */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
            <h3 className="text-indigo-900 font-bold mb-2 flex items-center gap-2">
                <CheckCircle size={16} />
                Lancify Protection
            </h3>
            <p className="text-xs text-indigo-700/80 font-bold leading-relaxed">Your payment is secured by our escrow system. We take a flat 10% fee to maintain the platform and protect both parties.</p>
        </div>
      </div>
    </div>
  );
}
