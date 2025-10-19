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
import { PencilIcon } from "lucide-react";
import { Spinner } from "@radix-ui/themes";

type ProjWithClient = Project & { client: User };

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id;
  const { theme } = useTheme();

  const [project, setProject] = useState<ProjWithClient>();
  const [proposalStatus, setProposalStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    bidAmount?: string;
    proposalMessage?: string;
  }>({});

  useEffect(() => {
    const fetchProj = async () => {
      try {
        const proj: { getProjectById: ProjWithClient } =
          await gqlClient.request(GET_ONE_PROJECT, { id });
        setProject(proj.getProjectById);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load project.");
      }
    };
    fetchProj();
  }, [id]);

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
      toast.success("Proposal submitted successfully!");
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

  return (
    <div
      className={`min-h-screen py-10 px-6 md:px-12 ${
        theme === "dark"
          ? "bg-background text-foreground"
          : "bg-background text-foreground"
      }`}
    >
      {/* Header with Proposal Status + Submit/Edit button */}
      <div className="flex justify-between items-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-extrabold hero-gradient"
        >
          Project Details
        </motion.h1>
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="py-2 px-4 rounded-xl button-gradient text-white font-semibold cursor-pointer shadow-glow flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            {proposalStatus ? (
              <>
                <PencilIcon className="w-5 h-5" />
                Proposal Submitted
              </>
            ) : (
              "Submit Proposal"
            )}
          </motion.button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
        {/* Left - Project Info */}
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
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-1 text-muted">
                  Description
                </h3>
                <p className="text-foreground">{project?.description}</p>
              </div>

              {/* Budget */}
              <div>
                <h3 className="text-lg font-semibold mb-1 text-muted">
                  Budget
                </h3>
                <p className="text-foreground">${project?.budget}</p>
              </div>

              {/* Deadline */}
              <div>
                <h3 className="text-lg font-semibold mb-1 text-muted">
                  Deadline
                </h3>
                <p className="text-foreground">
                  {formatDate(Number(project?.deadline))}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right - Client Card */}
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
              className="w-20 h-20 rounded-full mx-auto mb-2"
            />
            <h3 className="font-semibold text-primary">
              {project?.client.name}
            </h3>
            <p className="text-muted text-sm mt-1">{project?.client.bio}</p>

            {/* Submit Proposal button for OPEN projects (if not submitted) */}
            {/* {project?.status === "OPEN" && !proposalStatus && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="mt-6 w-full py-2 rounded-xl button-gradient text-white font-semibold cursor-pointer"
                onClick={() => {
                  setErrors({});
                  setIsModalOpen(true);
                }}
              >
                Submit Proposal
              </motion.button>
            )} */}
          </motion.div>
        </motion.div>
      </div>

      {/* Proposal Modal */}
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
                    ? "Update"
                    : "Submit"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
