"use client";

import { ACCEPT_PROPOSAL, GET_ONE_PROJECT } from "@/src/lib/gql/queries";
import { REJECT_PROPOSAL } from "@/src/lib/gql/mutation";
import { gqlClient } from "@/src/lib/service/gql";
import { Project, Proposal, User, ProjectStatus, ProposalStatus, Contract } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { DollarSign, Calendar, Users, ChevronLeft, MapPin, CheckCircle, XCircle, Clock, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { Spinner } from "@radix-ui/themes";
import Link from "next/link";

export interface ProjectResponse {
  getProjectById: Project & {
    client: User & { totalProjects?: number; hiringRate?: number };
    proposals: (Proposal & { freelancer: User })[];
    contract: Contract | null;
  };
}

export default function ProjectPage() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<ProjectResponse["getProjectById"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      try {
        const res = await gqlClient.request<ProjectResponse>(GET_ONE_PROJECT, { id });
        if (res.getProjectById) {
          setProject(res.getProjectById);
        }
      } catch (err) {
        console.error("Error fetching project data:", err);
        toast.error("Failed to fetch project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [id]);

  const onAcceptProposal = async (proposalId: string) => {
    setActionLoading(proposalId);
    try {
      const res: { acceptProposal: Proposal } = await gqlClient.request(
        ACCEPT_PROPOSAL,
        { proposalId }
      );
      if (res.acceptProposal) {
        toast.success("Proposal accepted & contract created!");
        setProject(prev => prev ? { ...prev, status: "HIRED" as ProjectStatus } : null);
        // Refresh local state for proposals
        if (project) {
          const updatedProposals = project.proposals.map(p =>
            p.id === proposalId
              ? { ...p, status: "ACCEPTED" as ProposalStatus }
              : { ...p, status: "REJECTED" as ProposalStatus }
          );
          setProject(prev => prev ? { ...prev, proposals: updatedProposals } : null);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to accept proposal.");
    } finally {
      setActionLoading(null);
    }
  };

  const onRejectProposal = async (proposalId: string) => {
    setActionLoading(proposalId);
    try {
      const res: { rejectProposal: Proposal } = await gqlClient.request(
        REJECT_PROPOSAL,
        { proposalId }
      );
      if (res.rejectProposal) {
        toast.success("Proposal declined!");
        if (project) {
          const updatedProposals = project.proposals.map(p =>
            p.id === proposalId ? { ...p, status: "REJECTED" as ProposalStatus } : p
          );
          setProject(prev => prev ? { ...prev, proposals: updatedProposals } : null);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to decline proposal.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="h-6 w-32 bg-slate-100 rounded animate-pulse" />
        <SkeletonCard />
        <div className="space-y-3">
          <div className="h-6 w-48 bg-slate-100 rounded animate-pulse mb-4" />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  if (!project) return (
    <div className="max-w-4xl mx-auto py-20 text-center">
      <h2 className="text-xl font-bold text-slate-900">Project Not Found</h2>
      <Link href="/client/project" className="text-primary font-bold mt-4 inline-block underline">Back to Projects</Link>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <Link
        href="/client/project"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Projects
      </Link>

      {/* Contract Redirection Banner */}
      {project.status !== "OPEN" && project.contract && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 text-emerald-700">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold">Project in Progress</p>
              <p className="text-xs font-medium opacity-80 underline decoration-emerald-200 decoration-2 underline-offset-2">Contract #{project.contract.id.slice(-6).toUpperCase()} is currently active.</p>
            </div>
          </div>
          <Link
            href={`/client/contract/${project.contract.id}`}
            className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 whitespace-nowrap"
          >
            Go to Contract
          </Link>
        </div>
      )}

      {/* Main Project Card */}
      <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4 mb-4">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 leading-tight">{project.title}</h1>
          <StatusBadge status={project.status} size="md" />
        </div>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed mb-6 whitespace-pre-wrap">{project.description}</p>

        <div className="flex flex-wrap gap-5 text-sm text-slate-500 border-t border-slate-100 pt-5 font-bold">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <DollarSign size={16} />
            </div>
            <span>${project.budget.toLocaleString()} budget</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Calendar size={16} />
            </div>
            <span>Due {new Date(Number(project.deadline)).toLocaleDateString(undefined, {
              month: 'short', day: 'numeric', year: 'numeric'
            })}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-50 text-slate-600 flex items-center justify-center font-bold">
              <Users size={16} />
            </div>
            <span>{project.proposals.length} proposal{project.proposals.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Dynamic Client Stats Card (Kept because it was requested as dynamic) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <Avatar className="w-12 h-12 rounded-xl border-2 border-slate-700">
              <AvatarImage src={project.client.avatar || ""} />
              <AvatarFallback>{project.client.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-lg leading-none mb-1">{project.client.name}</p>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Project Owner</p>
            </div>
          </div>
          <div className="flex gap-8">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Projects</p>
              <p className="text-xl font-bold">{(project.client).totalProjects || 0}</p>
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Hiring Rate</p>
              <p className="text-xl font-bold text-emerald-400">{(project.client).hiringRate || 0}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Proposals Section */}
      <div className="pt-4">
        <h2 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
          Proposals
          {project.proposals.length > 0 && (
            <span className="bg-slate-100 text-slate-500 text-xs py-0.5 px-2 rounded-full font-bold">
              {project.proposals.length}
            </span>
          )}
        </h2>

        {project.proposals.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No proposals yet"
            description="Freelancers haven't submitted proposals for this project yet. Check back soon."
          />
        ) : (
          <div className="space-y-4">
            {project.proposals.map((proposal) => (
              <div key={proposal.id} className={`bg-white border rounded-xl p-5 transition-all shadow-sm ${proposal.status === 'ACCEPTED' ? 'border-primary/30 ring-2 ring-primary/5' : 'border-border'}`}>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 rounded-lg border border-slate-100">
                      <AvatarImage src={proposal.freelancer.avatar || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">{proposal.freelancer.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{proposal.freelancer.name}</p>
                      <p className="text-xs font-bold text-primary truncate uppercase tracking-tight">{proposal.freelancer.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={proposal.status} />
                    <span className="text-base font-black text-slate-900">${proposal.amount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 mb-5">
                  <p className="text-slate-600 text-sm leading-relaxed italic">{`"${proposal.coverLetter}"`}</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  {proposal.freelancer.skills?.slice(0, 5).map(skill => (
                    <span key={skill} className="px-2.5 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-tight">{skill}</span>
                  ))}
                </div>

                {proposal.status === "SUBMITTED" && project.status === "OPEN" && (
                  <div className="flex gap-3 pt-4 border-t border-slate-50">
                    <button
                      onClick={() => onAcceptProposal(proposal.id)}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 shadow-md shadow-primary/10"
                    >
                      {actionLoading === proposal.id ? <Spinner /> : <CheckCircle className="w-4 h-4" />}
                      Accept & Hire
                    </button>
                    <button
                      onClick={() => onRejectProposal(proposal.id)}
                      disabled={!!actionLoading}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-slate-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-red-50 hover:text-red-500 hover:border-red-100 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
                    >
                      <XCircle className="w-4 h-4" />
                      Decline
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
