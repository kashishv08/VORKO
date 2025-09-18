"use client";
import { Project, User } from "@prisma/client";
import { BookmarkIcon, MessageCircle } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ProjectWithClientProposalContract } from "../../../client/project/[id]/page";
import { gqlClient } from "@/src/lib/service/gql";
import { GET_ONE_PROJECT } from "@/src/lib/gql/queries";

type ProjWithClient = Project & { client: User };

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params.id;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [proposalStatus, setProposalStatus] = useState("");
  const [project, setProject] = useState<ProjWithClient>();

  useEffect(() => {
    const fetchProj = async () => {
      const proj: {
        getProjectById: ProjWithClient;
      } = await gqlClient.request(GET_ONE_PROJECT, {
        id,
      });
      setProject(proj.getProjectById);
    };
    fetchProj();
  }, [id]);

  const handleSubmitProposal = () => {
    // Here you can call your API to submit proposal
    setProposalStatus("SUBMITTED");
    setIsModalOpen(false);
    alert("Proposal submitted!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="inline-flex w-full justify-between items-center p-5">
        <h1 className="text-2xl font-bold">Project Description</h1>
        <div className="flex">
          <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-tl-md rounded-bl-md hover:bg-gray-100 transition">
            <BookmarkIcon className="w-5 h-5" />
            Save
          </button>

          <button className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-tr-md rounded-br-md hover:bg-gray-100 transition">
            <MessageCircle className="w-5 h-5" />
            Chat
          </button>
        </div>
      </div>
      <div className="max-w-6xl mx-auto flex gap-6">
        {/* Left Section */}
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-2xl font-bold mb-2">{project?.title}</h1>
            {/* <p className="text-gray-500 mb-4">{project?.category}</p> */}

            <p className="text-gray-700 mb-4">{project?.description}</p>

            <div className="flex gap-6">
              <div>
                <span className="font-semibold">Budget:</span> $
                {project?.budget}
              </div>
              <div>
                <span className="font-semibold">Deadline:</span>{" "}
                {project?.deadline &&
                  new Date(project.deadline).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg mb-2">Project Overview</h2>
            <p className="text-gray-700">
              Client you onuples in about in note ning for ons...
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-80 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <img
              src={project?.client.avatar || "/image.png"}
              alt="client"
              className="w-20 h-20 rounded-full mx-auto mb-2"
            />
            <h3 className="font-semibold">{project?.client.name}</h3>
            <p className="text-yellow-500 inline-flex flex-col">
              {project?.client.bio}
            </p>

            <div className="flex flex-wrap gap-2 mt-2 justify-center">
              {project?.client.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2 py-1 border rounded text-sm text-gray-600"
                >
                  {skill}
                </span>
              ))}
            </div>
            <button className="mt-4 w-full bg-blue-800 text-white py-2 rounded hover:bg-blue-900">
              View Profile
            </button>
          </div>

          {/* Proposal Section */}
          {project?.status === "OPEN" && !proposalStatus && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <button
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                onClick={() => setIsModalOpen(true)}
              >
                Submit Proposal
              </button>
            </div>
          )}

          {proposalStatus && (
            <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-700">
              Proposal Status:{" "}
              <span className="font-semibold">{proposalStatus}</span>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Submit Proposal</h2>

            <label className="block mb-2 font-medium">Bid Amount</label>
            <input
              type="number"
              className="w-full border p-2 rounded mb-4"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />

            <label className="block mb-2 font-medium">Proposal Message</label>
            <textarea
              className="w-full border p-2 rounded mb-4"
              rows={4}
              value={proposalMessage}
              onChange={(e) => setProposalMessage(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-100"
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
