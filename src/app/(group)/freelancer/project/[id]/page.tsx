"use client";
import { CREATE_PROPOSAL } from "@/src/lib/gql/mutation";
import { GET_ONE_PROJECT } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { Project, User } from "@prisma/client";
import { BookmarkIcon, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@/src/components/context/ThemeContext";

type ProjWithClient = Project & { client: User };

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id;
  const { theme } = useTheme();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [proposalStatus, setProposalStatus] = useState("");
  const [project, setProject] = useState<ProjWithClient>();

  // validation state
  const [errors, setErrors] = useState<{
    bidAmount?: string;
    proposalMessage?: string;
  }>({});

  useEffect(() => {
    const fetchProj = async () => {
      const proj: { getProjectById: ProjWithClient } = await gqlClient.request(
        GET_ONE_PROJECT,
        { id }
      );
      setProject(proj.getProjectById);
    };
    fetchProj();
  }, [id]);

  const handleSubmitProposal = async () => {
    const newErrors: typeof errors = {};

    if (!bidAmount || Number(bidAmount) <= 0) {
      newErrors.bidAmount = "Please enter a valid bid amount";
    }
    if (!proposalMessage.trim()) {
      newErrors.proposalMessage = "Proposal message cannot be empty";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await gqlClient.request(CREATE_PROPOSAL, {
        amount: Number(bidAmount),
        coverLetter: proposalMessage,
        projectId: id,
      });
      setProposalStatus("SUBMITTED");
      setIsModalOpen(false);
      alert("Proposal submitted!");
    } catch (err) {
      console.error(err);
      alert("Error submitting proposal");
    }
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* top bar */}
      <div className="inline-flex w-full justify-between items-center p-5">
        <h1 className="text-2xl font-bold">Project Description</h1>
        <div className="flex">
          <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-tl-md rounded-bl-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <BookmarkIcon className="w-5 h-5" />
            Save
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-tr-md rounded-br-md hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <MessageCircle className="w-5 h-5" />
            Chat
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto flex gap-6">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          <div className="p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800">
            <h1 className="text-2xl font-bold mb-2">{project?.title}</h1>
            <p className="mb-4 text-gray-700 dark:text-gray-300">
              {project?.description}
            </p>
            <div className="flex gap-6 text-gray-600 dark:text-gray-400">
              <div>
                <span className="font-semibold">Budget:</span> $
                {project?.budget}
              </div>
              <div>
                <span className="font-semibold">Deadline:</span>{" "}
                {project?.deadline &&
                  new Date(Number(project.deadline)).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-80 space-y-6">
          <div className="p-6 rounded-lg shadow-sm text-center bg-white dark:bg-gray-800">
            <Image
              height={100}
              width={100}
              src={project?.client.avatar || "/image.png"}
              alt="client"
              className="w-20 h-20 rounded-full mx-auto mb-2"
            />
            <h3 className="font-semibold">{project?.client.name}</h3>
            <p className="text-yellow-500 inline-flex flex-col">
              {project?.client.bio}
            </p>
          </div>

          {project?.status === "OPEN" && !proposalStatus && (
            <div className="p-6 rounded-lg shadow-sm bg-white dark:bg-gray-800">
              <button
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                onClick={() => {
                  setErrors({});
                  setIsModalOpen(true);
                }}
              >
                Submit Proposal
              </button>
            </div>
          )}

          {proposalStatus && (
            <div className="p-6 rounded-lg shadow-sm text-center text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800">
              Proposal Status:{" "}
              <span className="font-semibold">{proposalStatus}</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 dark:bg-black/70 flex items-center justify-center">
          <div className="p-6 rounded-lg w-96 bg-white dark:bg-gray-800 transition-colors">
            <h2 className="text-xl font-semibold mb-4">Submit Proposal</h2>

            <label className="block mb-2 font-medium">Bid Amount</label>
            <input
              type="number"
              className="w-full border p-2 rounded mb-1 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
            {errors.bidAmount && (
              <p className="text-red-500 text-sm mb-2">{errors.bidAmount}</p>
            )}

            <label className="block mb-2 font-medium">Proposal Message</label>
            <textarea
              className="w-full border p-2 rounded mb-1 bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600"
              rows={4}
              value={proposalMessage}
              onChange={(e) => setProposalMessage(e.target.value)}
            ></textarea>
            {errors.proposalMessage && (
              <p className="text-red-500 text-sm mb-2">
                {errors.proposalMessage}
              </p>
            )}

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:border-gray-600"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleSubmitProposal}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
