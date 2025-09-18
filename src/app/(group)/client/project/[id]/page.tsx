import { GET_ONE_PROJECT } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { Contract, Project, ProjectStatus, User } from "@prisma/client";
import React from "react";

type paramsId = Promise<{
  id: string;
}>;

type Proposal = {
  id: string;
  freelancerName: string;
  coverLetter: string;
  amount: number;
  status: "SUBMITTED" | "ACCEPTED" | "REJECTED";
  createdAt: string;
};

export type ProjectWithClientProposalContract = Project & { client: User } & {
  proposals: Proposal[];
} & { contract: Contract };

export default async function ProjectDetailPage({
  params,
}: {
  params: paramsId;
}) {
  const { id } = await params;

  const proj: {
    getProjectById: Project;
  } = await gqlClient.request(GET_ONE_PROJECT, {
    id,
  });
  const project = proj.getProjectById as ProjectWithClientProposalContract;

  //   const onAcceptProposal = (proposalId: string) => {
  //     const ok = confirm("Accept this proposal and create contract?");
  //     if (!ok) return;
  //     // call acceptProposal mutation
  //     alert(`Accepted proposal ${proposalId} (implement mutation -> create contract)`);
  //   };

  //   const onRejectProposal = (proposalId: string) => {
  //     const ok = confirm("Reject this proposal?");
  //     if (!ok) return;
  //     // call rejectProposal mutation
  //     alert(`Rejected proposal ${proposalId} (implement mutation)`);
  //   };

  const formatDate = (iso: number) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">{project.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Created: {formatDate(Number(project?.createdAt))}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap
              ${
                project.status === "OPEN"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
          >
            {project.status}
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

      {/* Project Info Card */}
      <div className="bg-white border rounded-lg p-6 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <h2 className="text-lg font-semibold mb-2">Project Overview</h2>
            <p className="text-gray-700 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">Budget</p>
              <p className="text-lg font-semibold">
                ${project.budget.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Deadline</p>
              <p className="text-lg">{formatDate(Number(project.deadline))}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Client</p>
              <p className="text-lg">{project.client.name ?? "—"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Proposals Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Proposals Received</h3>
          <div className="text-sm text-gray-500">
            {project.proposals?.length} proposals
          </div>
        </div>

        {project.proposals.length === 0 ? (
          <div className="bg-white border rounded-lg p-6 text-center text-gray-600">
            No proposals yet.
          </div>
        ) : (
          <div className="space-y-4">
            {project.proposals.map((p) => (
              <div
                key={p.id}
                className="bg-white border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                      {p.freelancerName.split(" ")[0].charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">
                        {p.freelancerName}
                      </div>
                      <div className="text-sm text-gray-700 font-medium">
                        ${p.amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 text-gray-700">{p.coverLetter}</p>
                </div>

                <div className="flex-shrink-0 flex flex-col items-end gap-2">
                  <div className="text-sm text-gray-500">
                    {formatDate(Number(p.createdAt))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    {p.status === "SUBMITTED" && (
                      <>
                        <button
                          //   onClick={() => onAcceptProposal(p.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded-md text-sm"
                        >
                          Accept
                        </button>
                        <button
                          //   onClick={() => onRejectProposal(p.id)}
                          className="px-3 py-1 bg-gray-100 rounded-md text-sm"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {p.status === "ACCEPTED" && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm">
                        Accepted
                      </span>
                    )}

                    {p.status === "REJECTED" && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-md text-sm">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contract Section */}
      <div>
        <h3 className="text-xl font-semibold mb-4">Contract</h3>
        {project.contract ? (
          <div className="bg-white border rounded-lg p-4 flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Freelancer</div>
              <div className="font-medium">{"freelancer Name"}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Status</div>
              <div className="font-medium">{project.contract.status}</div>
            </div>
            <div className="ml-4">
              <button
                className="px-3 py-2 bg-blue-600 text-white rounded-md"
                onClick={() => alert("Go to contract detail (chat, files)")}
              >
                View Contract
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white border rounded-lg p-6 text-gray-600">
            No contract exists yet for this project.
          </div>
        )}
      </div>
    </div>
  );
}
