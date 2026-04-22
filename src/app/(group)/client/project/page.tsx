"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { gqlClient } from "@/src/lib/service/gql";
import { CLIENT_PROJ } from "@/src/lib/gql/queries";
import { Project, Contract, Proposal } from "@prisma/client";

type ProjectWithMetadata = Project & {
  contract?: { status: string } | null;
  proposals?: { id: string }[];
};
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonStatCard } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Briefcase, ArrowRight, DollarSign, Calendar, Users, PlusCircle, Plus } from "lucide-react";

export default function MyProjectsPage() {
  const { isLoaded, userId } = useAuth();
  const [projects, setProjects] = useState<ProjectWithMetadata[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const fetchProj = async () => {
      setLoading(true);
      try {
        const proj: { clientAllPostedProjects: ProjectWithMetadata[] } = await gqlClient.request(CLIENT_PROJ, { id: userId });
        const all = proj.clientAllPostedProjects || [];
        // Sort by newest first
        const sorted = [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setProjects(sorted);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProj();
  }, [isLoaded, userId]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Projects</h1>
          <p className="text-sm text-slate-500 mt-0.5">{projects.length} project{projects.length !== 1 ? "s" : ""} total</p>
        </div>

        <Link
          href="/client/project/new"
          data-testid="button-new-project"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Post a Project
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonStatCard key={i} />)}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No projects yet"
          description="Post your first project to start receiving proposals from talented freelancers."
          action={{ label: "Post a Project", onClick: () => window.location.href = "/client/project/new" }}
        />
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/client/project/${project.id}`}
              className="block bg-white border border-border rounded-xl p-5 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary transition-colors">{project.title}</h3>
                    <StatusBadge status={project.contract?.status === "COMPLETED" ? "COMPLETED" : project.status} />
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5 text-slate-900">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      ${project.budget.toLocaleString()} budget
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      Deadline: {new Date(Number(project.deadline)).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5" />
                      {project.proposals?.length ?? 0} proposal{(project.proposals?.length ?? 0) !== 1 ? "s" : ""}
                    </span>
                    <span className="ml-auto text-slate-400 font-normal">
                      Posted {new Date(Number(project.createdAt)).toLocaleDateString()}
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
