"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { gqlClient } from "@/src/lib/service/gql";
import { GET_FREELANCER_CONTRACT } from "@/src/lib/gql/queries";
import { Contract, Project, Proposal, User } from "@prisma/client";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText, DollarSign, Calendar, ArrowRight } from "lucide-react";
import { SkeletonCard } from "@/components/ui/SkeletonCard";

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
        const res: { getFreelancerActiveContracts: FreelancerContract[] } = await gqlClient.request(GET_FREELANCER_CONTRACT);
        setContracts(res?.getFreelancerActiveContracts || []);
      } catch (err) {
        console.error("Failed to load contracts", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Contracts</h1>
        <p className="text-sm text-slate-500 mt-0.5">{contracts.length} contract{contracts.length !== 1 ? "s" : ""} total</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : contracts.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No contracts yet"
          description="Your accepted proposals will appear here as contracts."
          action={{ label: "Browse Projects", onClick: () => window.location.href = "/freelancer/project" }}
        />
      ) : (
        <div className="space-y-3">
          {contracts.map((contract) => (
            <Link
              key={contract.id}
              href={`/freelancer/contract/${contract.id}`}
              className="block bg-white border border-border rounded-xl p-5 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary transition-colors truncate">
                      {contract.project?.title ?? "Contract"}
                    </h3>
                    <StatusBadge status={contract.status} />
                  </div>
                  <p className="text-xs text-slate-500 mb-3 font-medium">
                    Client: {contract.client?.name}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                    <span className="flex items-center gap-1 text-slate-900">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      ${contract.project?.budget.toLocaleString() || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {new Date(Number(contract.createdAt)).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all flex-shrink-0 mt-0.5">
                    <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
