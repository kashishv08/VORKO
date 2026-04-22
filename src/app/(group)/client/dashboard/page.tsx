"use client";

import { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonStatCard } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { CLIENT_DASHBOARD } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { DollarSign, Briefcase, CheckCircle, Clock, ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import RecentMessages from "@/src/components/chat/RecentMessages";

type DashboardData = {
  activeProjectsCount: number;
  activeContractsCount: number;
  proposalsPendingCount: number;
  activeProjects: {
    id: string;
    title: string;
    description: string;
    budget: number;
    deadline: string;
    status: string;
    createdAt: string;
    contract?: {
      status: string;
    };
  }[];
  totalspent: number;
  analytics: {
    month: string;
    total: number;
  }[];
};

export default function ClientDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasChats, setHasChats] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res: { clientDashboard: DashboardData } = await gqlClient.request(CLIENT_DASHBOARD);
        const rawData = res.clientDashboard;
        if (!rawData.analytics || rawData.analytics.length === 0) {
          rawData.analytics = Array.from({ length: 6 }, (_, i) => {
            const d = new Date();
            d.setMonth(d.getMonth() - (5 - i));
            return {
              month: d.toLocaleString('default', { month: 'short' }),
              total: 0
            };
          });
        }
        setData(rawData);
      } catch (error) {
        console.error("Error fetching client dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1 font-medium">Here&apos;s what&apos;s happening with your projects.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)
        ) : (
          <>
            <StatCard 
              label="Active Projects" 
              value={data?.activeProjectsCount ?? 0} 
              icon={Briefcase} 
            />
            <StatCard 
              label="Pending Proposals" 
              value={data?.proposalsPendingCount ?? 0} 
              icon={Clock} 
              iconColor="text-amber-500" 
            />
            <StatCard 
              label="Total Spending" 
              value={`$${(data?.totalspent ?? 0).toLocaleString()}`} 
              icon={DollarSign} 
              iconColor="text-blue-500" 
            />
            <StatCard 
              label="Active Contracts" 
              value={data?.activeContractsCount ?? 0} 
              icon={CheckCircle} 
              iconColor="text-emerald-500" 
            />
          </>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-border rounded-xl p-5 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900 mb-4">Spending Overview</h2>
            <div className="h-[200px] w-full">
                {loading ? (
                    <div className="w-full h-full bg-slate-50 animate-pulse rounded-lg" />
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data?.analytics ?? []}>
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                            <Tooltip 
                                cursor={{fill: 'rgba(20, 168, 0, 0.05)'}} 
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="total" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>

        <div className="bg-white border border-border rounded-xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                Recent Activity
            </h2>
            {hasChats && (
              <Link href="/client/chat" className="text-sm font-bold text-primary hover:underline">
                View all
              </Link>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
              <RecentMessages onData={setHasChats} />
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-slate-900">Recent Projects</h2>
          <Link href="/client/project" className="text-sm font-bold text-primary hover:underline flex items-center gap-1 transition-all">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-50 rounded-lg animate-pulse border border-slate-100" />
            ))}
          </div>
        ) : !data?.activeProjects.length ? (
          <EmptyState
            icon={Briefcase}
            title="No projects yet"
            description="Post your first project to get started."
            action={{ label: "Post a Project", onClick: () => window.location.href = "/client/project/new" }}
          />
        ) : (
          <div className="space-y-2">
            {data.activeProjects.map((project) => (
              <Link
                key={project.id}
                href={`/client/project/${project.id}`}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate group-hover:text-primary transition-colors">{project.title}</p>
                  <p className="text-xs font-medium text-slate-500 mt-0.5">${project.budget.toLocaleString()} budget</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={project.contract?.status === 'COMPLETED' ? 'CLOSED' : project.status} />
                  <ArrowRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
