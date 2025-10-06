"use client";

import { ACCEPT_PROPOSAL, PROJECT_PROPOSALS } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { Project, Proposal, User } from "@prisma/client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, Spinner } from "@radix-ui/themes";
import { FaDollarSign, FaCalendarAlt, FaCheck, FaTimes } from "react-icons/fa";
import { REJECT_PROPOSAL } from "@/src/lib/gql/mutation";

type ProposalType = (Proposal & { project: Project & { client: User } } & {
  freelancer: User;
})[];

export default function ProjectPage() {
  const [proposals, setProposals] = useState<ProposalType>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const { id } = useParams();

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
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, [id]);

  const onAcceptProposal = async (proposalId: string) => {
    setLoading(true);
    try {
      const prop: { acceptProposal: Proposal } = await gqlClient.request(
        ACCEPT_PROPOSAL,
        { proposalId }
      );
      if (prop?.acceptProposal) {
        setProposals((prev) =>
          prev.map((proposal) =>
            proposal.id === proposalId
              ? {
                  ...proposal,
                  status: "ACCEPTED",
                  project: {
                    ...proposal.project,
                    status: "HIRED",
                  },
                }
              : proposal
          )
        );
        alert("Accepted & project hired!");
      }
    } catch (err) {
      console.error(err);
      alert("Acceptance failed.");
    } finally {
      setLoading(false);
    }
  };

  const onRejectProposal = async (proposalId: string) => {
    setLoading(true);
    try {
      const response: { rejectProposal: Proposal } = await gqlClient.request(
        REJECT_PROPOSAL,
        { proposalId }
      );
      if (response?.rejectProposal) {
        setProposals((prev) =>
          prev.map((proposal) =>
            proposal.id === proposalId
              ? { ...proposal, status: "REJECTED" }
              : proposal
          )
        );
        alert("Proposal rejected!");
      }
    } catch (err) {
      console.error(err);
      alert("Rejection failed.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (iso: number) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-8 mt-4">
      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <Spinner size="2" />
        </div>
      ) : (
        <main className="max-w-5xl mx-auto px-4">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">{"Project Overview"}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Created: {formatDate(Number(proposals[0]?.project.createdAt))}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
              ${
                proposals[0]?.project.status === "OPEN"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
              >
                {proposals[0]?.project.status}
              </span>

              <button
                // onClick={onEdit}
                className="px-3 py-2 bg-white border rounded-md text-sm shadow-sm hover:bg-gray-50"
              >
                Edit Project
              </button>
              <button
                // onClick={onDelete}
                className="px-3 py-2 bg-red-600 text-white rounded-md text-sm shadow-sm hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
          {/* Project Details */}
          <section className="mb-8 bg-white shadow rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-lg font-semibold mb-2">
                  {proposals[0]?.project.title}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {proposals[0]?.project.description}
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Budget</p>
                  <p className="text-lg font-semibold">
                    ${proposals[0]?.project.budget.toLocaleString()}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 inline-flex gap-2 justify-center items-center">
                    {" "}
                    <FaCalendarAlt /> Deadline
                  </p>
                  <p className="text-lg">
                    {formatDate(Number(proposals[0]?.project.deadline))}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Client</p>
                  <p className="text-lg">
                    {proposals[0]?.project?.client?.name ?? "—"}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Proposals */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Proposals
            </h2>

            {proposals.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No proposals submitted for this project.
              </p>
            ) : (
              <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col hover:shadow-md transition-shadow relative"
                  >
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
                          <p className="font-semibold text-gray-800 text-sm">
                            {proposal.freelancer.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {proposal.freelancer.role} |{" "}
                            {proposal.freelancer.skills}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          proposal.status === "ACCEPTED"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {proposal.status}
                      </span>
                    </div>

                    {/* Cover Letter and Amount in Same Line */}
                    <div className="flex justify-between items-center mt-3">
                      <div className="text-sm text-gray-700 leading-relaxed max-w-[70%]">
                        {expanded
                          ? proposal.coverLetter
                          : proposal.coverLetter?.slice(0, 100) +
                            (proposal.coverLetter?.length > 100 ? "..." : "")}
                        {proposal.coverLetter?.length > 100 && (
                          <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-blue-600 text-xs ml-1 hover:underline"
                          >
                            {expanded ? "Show Less" : "Read More"}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Buttons at bottom right */}
                    <div className="flex gap-2 absolute bottom-3 right-3 justify-between">
                      {proposal.status === "SUBMITTED" && (
                        <>
                          <button
                            className="flex items-center gap-1 bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 transition"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to accept this proposal?"
                                )
                              ) {
                                onAcceptProposal(proposal.id);
                              }
                            }}
                          >
                            <FaCheck /> Accept
                          </button>
                          <button
                            className="flex items-center gap-1 bg-red-500 text-white text-xs px-3 py-1 rounded hover:bg-red-600 transition"
                            onClick={() => {
                              if (
                                window.confirm(
                                  "Are you sure you want to reject this proposal?"
                                )
                              ) {
                                onRejectProposal(proposal.id);
                              }
                            }}
                          >
                            <FaTimes /> Reject
                          </button>
                        </>
                      )}

                      <p className="text-gray-800 text-sm font-semibold whitespace-nowrap">
                        Proposal Amount: ${proposal.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </main>
      )}
    </div>
  );
}
