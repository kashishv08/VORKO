"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { gqlClient } from "@/src/lib/service/gql";
import { GET_FREELANCER_CONTRACT } from "@/src/lib/gql/queries";
import { Contract, Project, Proposal, User } from "@prisma/client";
import { Avatar, Spinner } from "@radix-ui/themes";
import { FaCalendarAlt, FaDollarSign } from "react-icons/fa";

export type FreelancerContract = Contract & {
  project: Project;
  client: User;
  freelancer: User;
  proposal: Proposal[];
};

export default function FreelancerContractsPage() {
  const [contracts, setContracts] = useState<FreelancerContract[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      setLoading(true);
      try {
        const res: { getFreelancerActiveContracts: FreelancerContract[] } =
          await gqlClient.request(GET_FREELANCER_CONTRACT);
        setContracts(res?.getFreelancerActiveContracts || []);
      } catch (err) {
        console.error("Failed to load contracts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  const formatDate = (iso: number) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner size="3" />
      </div>
    );
  }

  console.log(contracts);

  return (
    <div className="min-h-screen px-6 py-8 bg-background ">
      <h5 className="mx-auto text-xl font-bold mb-4">All Contracts</h5>
      <div className="mx-auto max-w-5xl space-y-8">
        {contracts.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-muted text-lg">
              You don’t have any active contracts yet.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {contracts.map((contract: FreelancerContract) => (
              <div
                key={contract.id}
                className="card flex flex-col sm:flex-row items-center sm:items-stretch justify-between gap-6 p-6"
              >
                {/* Left: Client Info */}
                <div className="flex items-center gap-5 flex-shrink-0">
                  <Avatar
                    src={contract.client.avatar || "/image.png"}
                    alt={contract.client.name}
                    fallback={contract.client.name.charAt(0).toUpperCase()}
                    size="6"
                  />
                  <div>
                    <div className="text-sm text-muted font-semibold">
                      Client
                    </div>
                    <div className="text-lg font-semibold text-foreground">
                      {contract.client.name}
                    </div>
                  </div>
                </div>

                {/* Middle: Project Info */}
                <div className="flex-1 flex flex-col gap-1 px-3 py-1 min-w-[220px]">
                  <h2 className="text-xl font-semibold text-foreground">
                    {contract.project.title}
                  </h2>
                  <div className="flex items-center gap-2 text-primary font-semibold">
                    <FaDollarSign />
                    {contract.project.budget.toLocaleString(undefined, {
                      minimumFractionDigits: 0,
                    })}
                  </div>
                  <div className="flex items-center gap-2 text-muted text-sm mt-1">
                    <FaCalendarAlt />
                    <span>Start: {formatDate(Number(contract.createdAt))}</span>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-col gap-4 mt-4 sm:mt-0">
                  <Link
                    href={`/freelancer/contract/${contract.id}`}
                    className="button-gradient text-white font-semibold py-3 px-6 rounded-lg text-center"
                  >
                    View Contract
                  </Link>
                  <span
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold select-none bg-surfaceGlass mt-2`}
                  >
                    {contract.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
