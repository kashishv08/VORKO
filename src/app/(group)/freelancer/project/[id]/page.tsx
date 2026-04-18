"use client";

import { CREATE_PROPOSAL } from "@/src/lib/gql/mutation";
import { GET_ONE_PROJECT } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { Project, User } from "@prisma/client";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/src/components/context/ThemeContext";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { PencilIcon, CheckCircle2, XCircle, Hourglass } from "lucide-react";
import { Spinner } from "@radix-ui/themes";
import { useUser } from "@clerk/nextjs";

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

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { theme } = useTheme();
  const { user, isLoaded } = useUser();

  const [project, setProject] = useState<ProjWithClient>();
  const [proposalStatus, setProposalStatus] = useState<
    "SUBMITTED" | "ACCEPTED" | "REJECTED" | ""
  >("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    bidAmount?: string;
    proposalMessage?: string;
  }>({});

  useEffect(() => {
    if (isModalOpen && proposalStatus === "SUBMITTED") {
      const existing = project?.proposals.find(
        (p) => p.freelancer?.clerkId === user?.id
      );
      if (existing) {
        setBidAmount(existing.amount.toString());
        setProposalMessage(existing.coverLetter);
      }
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!id || !isLoaded || !user) return;

    const fetchProj = async () => {
      try {
        const data: { getProjectById: ProjWithClient } =
          await gqlClient.request(GET_ONE_PROJECT, {
            id,
          });

        setProject(data.getProjectById);

        const existingProposal = data.getProjectById.proposals.find(
          (p) => p.freelancer?.clerkId === user.id // adjust if different ID mapping
        );

        if (existingProposal) {
          setProposalStatus(existingProposal.status);
          setBidAmount(existingProposal.amount.toString());
          setProposalMessage(existingProposal.coverLetter);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project.");
      }
    };

    fetchProj();
  }, [id, user, isLoaded]);

  // 🟢 Submit or edit proposal
  const handleSubmitProposal = async () => {
    const newErrors: typeof errors = {};
    if (!bidAmount || Number(bidAmount) <= 0)
      newErrors.bidAmount = "Enter a valid bid amount";
    if (!proposalMessage.trim())
      newErrors.proposalMessage = "Proposal message cannot be empty";
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await gqlClient.request(CREATE_PROPOSAL, {
        amount: Number(bidAmount),
        coverLetter: proposalMessage,
        projectId: id,
      });

      setProposalStatus("SUBMITTED");
      setIsModalOpen(false);
      toast.success(
        proposalStatus
          ? "Proposal updated successfully!"
          : "Proposal submitted!"
      );
    } catch (err) {
      console.error(err);
      toast.error("Error submitting proposal. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (deadline?: number | null) => {
    if (!deadline) return "-";
    return new Date(Number(deadline)).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!project) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="3" />
      </div>
    );
  }

  // 🟢 UI status message
  const renderProposalStatus = () => {
    switch (proposalStatus) {
      case "SUBMITTED":
        return (
          <div className="flex items-center gap-2 text-amber-500 bg-amber-100/10 px-4 py-2 rounded-lg border border-amber-400/20">
            <Hourglass className="w-5 h-5" />
            <span>Proposal submitted — waiting for client’s response.</span>
          </div>
        );
      case "ACCEPTED":
        return (
          <div className="flex items-center gap-2 text-emerald-500 bg-emerald-100/10 px-4 py-2 rounded-lg border border-emerald-400/20">
            <CheckCircle2 className="w-5 h-5" />
            <span>Your proposal has been accepted.</span>
          </div>
        );
      case "REJECTED":
        return (
          <div className="flex items-center gap-2 text-red-500 bg-red-100/10 px-4 py-2 rounded-lg border border-red-400/20">
            <XCircle className="w-5 h-5" />
            <span>Your proposal was rejected. Better luck next time.</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`min-h-screen py-10 px-6 md:px-12 bg-background text-foreground`}
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold hero-gradient"
        >
          Project Details
        </motion.h1>

        <motion.button
          whileHover={{ scale: 1.05 }}
          className="py-2 px-4 rounded-xl button-gradient text-white font-semibold cursor-pointer shadow-glow flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
          disabled={
            proposalStatus === "ACCEPTED" || proposalStatus === "REJECTED"
          }
        >
          {proposalStatus === "SUBMITTED" ? (
            <>
              <PencilIcon className="w-5 h-5" />
              Edit Proposal
            </>
          ) : proposalStatus ? (
            "Proposal Closed"
          ) : (
            "Submit Proposal"
          )}
        </motion.button>
      </div>

      {/* STATUS BANNER */}
      {renderProposalStatus() && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          {renderProposalStatus()}
        </motion.div>
      )}

      {/* CONTENT GRID */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        <motion.div layout className="flex-1 space-y-6">
          <motion.div
            whileHover={{
              scale: 1.02,
              boxShadow: "0 12px 28px var(--highlight)",
            }}
            className="card p-6"
          >
            <h2 className="text-2xl font-bold mb-4 text-primary">
              {project?.title}
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1 text-muted">
                  Description
                </h3>
                <p>{project?.description}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-muted">
                  Budget
                </h3>
                <p>${project?.budget}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1 text-muted">
                  Deadline
                </h3>
                <p>{formatDate(Number(project?.deadline))}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* CLIENT CARD */}
        <motion.div layout className="w-full lg:w-80 flex flex-col gap-6">
          <motion.div
            whileHover={{
              scale: 1.03,
              boxShadow: "0 12px 28px var(--highlight)",
            }}
            className="card p-6 text-center relative"
          >
            <Image
              src={project?.client.avatar || "/image.png"}
              alt="client"
              height={100}
              width={100}
              className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
            />
            <h3 className="font-semibold text-primary">
              {project?.client.name}
            </h3>
            <p className="text-muted text-sm mt-1">{project?.client.bio}</p>
          </motion.div>
        </motion.div>
      </div>

      {/* PROPOSAL MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md p-6 rounded-xl shadow-lg bg-surface transition-colors"
            >
              <h2 className="text-xl font-semibold mb-4 text-primary">
                {proposalStatus ? "Edit Proposal" : "Submit Proposal"}
              </h2>

              <label className="block mb-2 font-medium text-muted">
                Bid Amount
              </label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                className="w-full p-2 mb-2 rounded border border-border bg-surface text-foreground"
              />
              {errors.bidAmount && (
                <p className="text-red-500 text-sm mb-2">{errors.bidAmount}</p>
              )}

              <label className="block mb-2 font-medium text-muted">
                Proposal Message
              </label>
              <textarea
                rows={4}
                value={proposalMessage}
                onChange={(e) => setProposalMessage(e.target.value)}
                placeholder="Describe your timeline and approach..."
                className="w-full p-2 mb-2 rounded border border-border bg-surface text-foreground"
              />
              {errors.proposalMessage && (
                <p className="text-red-500 text-sm mb-2">
                  {errors.proposalMessage}
                </p>
              )}

              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="cursor-pointer px-4 py-2 rounded border border-border hover:bg-surface-glass transition"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitProposal}
                  disabled={isSubmitting}
                  className="cursor-pointer px-4 py-2 rounded-xl button-gradient text-white font-semibold"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : proposalStatus
                    ? "Update Proposal"
                    : "Submit Proposal"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
