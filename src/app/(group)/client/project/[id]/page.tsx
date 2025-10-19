"use client";

import { ACCEPT_PROPOSAL, PROJECT_PROPOSALS } from "@/src/lib/gql/queries";
import { REJECT_PROPOSAL } from "@/src/lib/gql/mutation";
import { gqlClient } from "@/src/lib/service/gql";
import { Project, Proposal, User } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, Spinner } from "@radix-ui/themes";
import { FaDollarSign, FaCalendarAlt, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

type ProposalType = (Proposal & { project: Project & { client: User } } & {
  freelancer: User;
})[];

export default function ProjectPage() {
  const { id } = useParams();
  const [proposals, setProposals] = useState<ProposalType>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch proposals
  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const res: { viewProposal: ProposalType } = await gqlClient.request(
          PROJECT_PROPOSALS,
          { projectId: id }
        );
        setProposals(res.viewProposal || []);
      } catch (err) {
        console.error("Error fetching proposals:", err);
        toast.error("Failed to fetch proposals.");
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, [id]);

  const onAcceptProposal = async (proposalId: string) => {
    setActionLoading(proposalId);
    try {
      const res: { acceptProposal: Proposal } = await gqlClient.request(
        ACCEPT_PROPOSAL,
        { proposalId }
      );
      if (res.acceptProposal) {
        setProposals((prev) =>
          prev.map((p) =>
            p.id === proposalId
              ? {
                  ...p,
                  status: "ACCEPTED",
                  project: { ...p.project, status: "HIRED" },
                }
              : p
          )
        );
        toast.success("Proposal accepted & project hired!");
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
        setProposals((prev) =>
          prev.map((p) =>
            p.id === proposalId ? { ...p, status: "REJECTED" } : p
          )
        );
        toast.success("Proposal rejected!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject proposal.");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (iso: number) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const project = proposals[0]?.project;

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-6 md:px-12 transition-colors duration-300">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner size="3" />
        </div>
      ) : (
        <main className="max-w-6xl mx-auto space-y-10 animate-fadeIn">
          {/* Header */}
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div>
              <h1 className="text-4xl font-extrabold hero-gradient bg-clip-text text-transparent">
                {project?.title || "Project Overview"}
              </h1>
              {/* <p className="text-sm text-muted mt-1">
                Created on:{" "}
                {project ? formatDate(Number(project.createdAt)) : "—"}
              </p> */}
            </div>

            {/* <span
              className={`px-4 py-2 rounded-full text-sm font-semibold shadow-glow ${
                project?.status === "OPEN"
                  ? "bg-[var(--primary)]/15 text-[var(--primary)]"
                  : project?.status === "HIRED"
                  ? "bg-[var(--highlight)]/20 text-[var(--highlight)]"
                  : "bg-[var(--surface-glass)] text-[var(--muted)]"
              }`}
            >
              {project?.status || "—"}
            </span> */}
          </motion.div>

          {/* Project Info */}
          <motion.section
            className="card p-8 rounded-2xl shadow-lg"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2">
                <p className="text-muted leading-relaxed">
                  {project?.description || "No description available."}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-xs text-muted uppercase">Budget</p>
                  <p className="text-lg font-semibold text-foreground mt-1 flex items-center gap-1">
                    <FaDollarSign /> {project?.budget?.toLocaleString() || "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase">Deadline</p>
                  <p className="text-lg font-semibold flex items-center gap-2 mt-1">
                    <FaCalendarAlt />
                    {project?.deadline
                      ? formatDate(Number(project.deadline))
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted uppercase">Client</p>
                  <p className="text-lg font-semibold mt-1">
                    {project?.client?.name || "—"}
                  </p>
                </div>
              </div>
            </div>
          </motion.section>

          {/* Proposals Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              Proposals
            </h2>

            {proposals.length === 0 ? (
              <p className="text-center text-muted py-10">
                No proposals submitted yet.
              </p>
            ) : (
              <div className="flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-2">
                <AnimatePresence>
                  {proposals.map((proposal) => (
                    <motion.div
                      key={proposal.id}
                      layout
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      // whileHover={{ scale: 1.02 }}
                      className="p-6 rounded-2xl shadow-md bg-[var(--surface-glass)] backdrop-blur-lg border border-white/10 transition-all duration-300 hover:shadow-glow"
                    >
                      {/* Freelancer Info */}
                      <div className="flex justify-between items-start">
                        <div className="flex gap-3 items-center">
                          <Avatar
                            src={proposal.freelancer.avatar || "/image.png"}
                            alt={proposal.freelancer.name}
                            fallback={proposal.freelancer.name
                              .charAt(0)
                              .toUpperCase()}
                            size="3"
                            color="blue"
                          />
                          <div>
                            <p className="font-semibold text-foreground text-sm">
                              {proposal.freelancer.name}
                            </p>
                            <p className="text-xs text-muted">
                              {proposal.freelancer.role} |{" "}
                              {proposal.freelancer.skills?.join(", ") || "—"}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            proposal.status === "ACCEPTED"
                              ? "bg-[var(--highlight)]/20 text-[var(--highlight)]"
                              : proposal.status === "REJECTED"
                              ? "bg-red-200/20 text-red-500"
                              : "bg-[var(--primary)]/15 text-[var(--primary)]"
                          }`}
                        >
                          {proposal.status}
                        </span>
                      </div>

                      {/* Cover Letter */}
                      <div className="mt-3 text-sm text-muted leading-relaxed">
                        {expanded === proposal.id
                          ? proposal.coverLetter
                          : proposal.coverLetter?.slice(0, 120) +
                            (proposal.coverLetter?.length > 120 ? "..." : "")}
                        {proposal.coverLetter?.length > 120 && (
                          <button
                            className="ml-2 text-[var(--primary)] text-xs hover:underline cursor-pointer"
                            onClick={() =>
                              setExpanded(
                                expanded === proposal.id ? null : proposal.id
                              )
                            }
                          >
                            {expanded === proposal.id
                              ? "Show Less"
                              : "Read More"}
                          </button>
                        )}
                      </div>

                      {/* Footer */}
                      <div className="flex justify-between items-center mt-5">
                        <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                          <FaDollarSign />
                          {proposal.amount}
                        </p>

                        {proposal.status === "SUBMITTED" && (
                          <div className="flex gap-3">
                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className={`cursor-pointer inline-flex items-center gap-1 px-4 py-1.5 rounded-md text-white text-xs font-semibold shadow-glow transition ${
                                actionLoading === proposal.id
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-[var(--primary)] hover:bg-[var(--primary-dark)]"
                              }`}
                              onClick={() => onAcceptProposal(proposal.id)}
                              disabled={actionLoading === proposal.id}
                            >
                              <FaCheck /> Accept
                            </motion.button>

                            <motion.button
                              whileTap={{ scale: 0.95 }}
                              className={`cursor-pointer inline-flex items-center gap-1 px-4 py-1.5 rounded-md text-white text-xs font-semibold shadow transition ${
                                actionLoading === proposal.id
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-red-500 hover:bg-red-600"
                              }`}
                              onClick={() => onRejectProposal(proposal.id)}
                              disabled={actionLoading === proposal.id}
                            >
                              <FaTimes /> Reject
                            </motion.button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
