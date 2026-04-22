"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonStatCard } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { EARNING_GRAPH, FREELANCER_DASHBOARD } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { DollarSign, FileText, Clock, CheckCircle, ArrowRight, TrendingUp } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import RecentMessages from "@/src/components/chat/RecentMessages";
import { useUser } from "@clerk/nextjs";

type DashboardData = {
  stats: {
    activeProposalsCount: number;
    activeContractsCount: number;
    totalCompletedContractsCount: number;
    totalEarnings: number;
  };
  latestProposals: {
    id: string;
    amount: number;
    status: string;
    project: {
      id: string;
      title: string;
      client: {
        name: string;
      }
    }
  }[];
  recentContracts: {
    id: string;
    status: string;
    amountPaid: number;
    freelancerAmount: number;
    project: {
      id: string;
      title: string;
    }
  }[];
};

type EarningPoint = {
  month: string;
  total: number;
};

export default function FreelancerDashboardPage() {
  const { user } = useUser();
  const [data, setData] = useState<DashboardData | null>(null);
  const [earningsData, setEarningsData] = useState<EarningPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const [hasChats, setHasChats] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, earningsRes] = (await Promise.all([
          gqlClient.request(FREELANCER_DASHBOARD),
          gqlClient.request(EARNING_GRAPH),
        ])) as [{ freelancerDashboard: DashboardData }, { earningsGraph: EarningPoint[] }];
        const fallbackData = Array.from({ length: 6 }, (_, i) => {
          const d = new Date();
          d.setMonth(d.getMonth() - (5 - i));
          return {
            month: d.toLocaleString('default', { month: 'short' }),
            total: 0
          };
        });

        setData(dashRes.freelancerDashboard);
        setEarningsData(earningsRes.earningsGraph?.length ? earningsRes.earningsGraph : fallbackData);
      } catch (error) {
        console.error("Error fetching freelancer dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">Your work overview at a glance.</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full uppercase tracking-wider">
          <TrendingUp size={12} />
          <span>Top Rated Potential</span>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <StatCard
              label="Total Earnings"
              value={`$${(data?.stats.totalEarnings ?? 0).toLocaleString()}`}
              icon={DollarSign}
              iconColor="text-green-600"
            />
            <StatCard
              label="Active Contracts"
              value={data?.stats.activeContractsCount ?? 0}
              icon={FileText}
              iconColor="text-blue-600"
            />
            <StatCard
              label="Accepted Proposals"
              value={data?.stats.activeProposalsCount ?? 0}
              icon={Clock}
              iconColor="text-yellow-600"
            />
            <StatCard
              label="Completed Contracts"
              value={data?.stats.totalCompletedContractsCount ?? 0}
              icon={CheckCircle}
              iconColor="text-emerald-600"
            />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-border rounded-xl p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900 mb-4">Earnings Over Time</h2>
          <div className="h-[200px] w-full">
            {loading ? (
              <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData}>
                  <defs>
                    <linearGradient id="earnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(131, 88%, 33%)" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="hsl(131, 88%, 33%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '11px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(v: number) => [`$${v.toLocaleString()}`, "Earned"]}
                  />
                  <Area type="monotone" dataKey="total" stroke="hsl(131, 88%, 33%)" strokeWidth={2} fillOpacity={1} fill="url(#earnings)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Quick Chat</h2>
            {hasChats && (
              <Link href="/freelancer/chat" className="text-sm font-bold text-primary hover:underline">
                View all
              </Link>
            )}
          </div>
          <div className="min-h-[200px]">
            <RecentMessages onData={setHasChats} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">Recent Contracts</h2>
          <Link href="/freelancer/contract" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />)}
          </div>
        ) : !data?.recentContracts.length ? (
          <EmptyState
            icon={FileText}
            title="No contracts yet"
            description="Submit proposals to projects you're interested in."
            action={{ label: "Browse Projects", onClick: () => window.location.href = "/freelancer/project" }}
          />
        ) : (
          <div className="space-y-2">
            {data.recentContracts.map((contract) => (
              <Link
                key={contract.id}
                href={`/freelancer/contract/${contract.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-100"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-primary transition-colors">{contract.project?.title || "Project Title"}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">${(contract.freelancerAmount || 0).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={contract.status} />
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-1 gap-6">
        <div className="lg:col-span-2 bg-white border border-border rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Recent Proposals</h2>
            <Link href="/freelancer/project" className="text-sm font-bold text-primary hover:underline">Find Work</Link>
          </div>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse" />)}
            </div>
          ) : !data?.latestProposals.length ? (
            <p className="text-sm text-slate-500 py-4">No active proposals found.</p>
          ) : (
            <div className="space-y-2">
              {data.latestProposals.map((proposal) => (
                <div key={proposal.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{proposal.project.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Bid: ${proposal.amount.toLocaleString()} • Client: {proposal.project.client.name}</p>
                  </div>
                  <StatusBadge status={proposal.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
