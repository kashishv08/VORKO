"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { gqlClient } from "@/src/lib/service/gql";
import { Avatar, Spinner } from "@radix-ui/themes";
import { FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import { ALL_CONTRACTS } from "@/src/lib/gql/queries";
import { Contract, Project, Proposal, User } from "@prisma/client";

export type contract = Contract & { project: Project } & {
  freelancer: User;
} & { client: User } & { proposal: Proposal[] };

export default function ClientContractsPage() {
  const [contracts, setContracts] = useState<contract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const res: { getClientActiveContracts: contract[] } =
          await gqlClient.request(ALL_CONTRACTS);
        setContracts(res?.getClientActiveContracts || []);
      } catch (err) {
        console.error("Failed to load contracts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  const formatDate = (iso: string | number) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner size={"3"} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          My Active Contracts
        </h1>

        {contracts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500 dark:text-gray-300 text-lg">
              You don’t have any active contracts yet.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {contracts.map((contract: contract) => (
              <div
                key={contract.id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-4"
              >
                {/* Left: Freelancer */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <Avatar
                    src={contract.freelancer.avatar || "/image.png"}
                    alt={contract.freelancer.name}
                    fallback={contract.freelancer.name.charAt(0).toUpperCase()}
                    size="5"
                  />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Freelancer
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {contract.freelancer.name}
                    </div>
                  </div>
                </div>

                {/* Middle: Project Info */}
                <div className="flex-1 flex flex-col gap-1 px-2 py-0 min-w-[200px]">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {contract.project.title}
                  </h2>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                    <FaDollarSign /> ${contract.project.budget.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-1">
                    <FaCalendarAlt />
                    <span>Start: {formatDate(Number(contract.createdAt))}</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-2 mt-3 sm:mt-0">
                  <Link
                    href={`/client/contract/${contract.id}`}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg transition-colors text-sm text-center"
                  >
                    View Contract
                  </Link>
                  <Link
                    href={`/client/messages/${contract.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm justify-center"
                  >
                    Messages
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold">
                      {contract.proposal?.length ?? 0}
                    </span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
