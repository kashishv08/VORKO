"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { gqlClient } from "@/src/lib/service/gql";
import { ALL_CLIENTS_PROJECTS } from "@/src/lib/gql/queries";
import { Project } from "@prisma/client";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Search, Briefcase, DollarSign, Users, SlidersHorizontal, X, Clock } from "lucide-react";

const categories = ["All", "Web Development", "Mobile Apps", "UI/UX Design", "Backend Development", "DevOps", "Data Science"];

export default function FreelancerProjectsPage() {
  const { isLoaded } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const proj: { allClientsProject: Project[] } = await gqlClient.request(ALL_CLIENTS_PROJECTS);
        // Only show open projects
        const open = (proj.allClientsProject || []).filter((p) => p.status === "OPEN");
        setProjects(open);
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) fetchProjects();
  }, [isLoaded]);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || p.description.toLowerCase().includes(category.toLowerCase()); // simple mapping for now
    const matchesBudget = !minBudget || p.budget >= Number(minBudget);
    return matchesSearch && matchesCategory && matchesBudget;
  });

  function clearFilters() {
    setSearch("");
    setCategory("");
    setMinBudget("");
  }

  const hasFilters = search || category || minBudget;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Find Work</h1>
        <p className="text-sm text-slate-500 mt-0.5">Browse open projects that match your skills.</p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects by title or keyword..."
            className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 border rounded-xl text-sm font-medium transition-colors ${showFilters ? "border-primary text-primary bg-primary/5" : "border-border bg-white hover:bg-slate-50"}`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {showFilters && (
        <div className="bg-white border border-border rounded-xl p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === "All" ? "" : cat)}
                  className={`px-3 py-1.5 text-xs rounded-full border font-bold transition-all ${
                    (cat === "All" && !category) || category === cat
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-slate-300 text-slate-500"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Minimum Budget</label>
            <div className="relative w-40">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
              <input
                type="number"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                placeholder="0"
                className="w-full pl-7 pr-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-bold"
              />
            </div>
          </div>
        </div>
      )}

      {hasFilters && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-500 font-medium">{filteredProjects.length} result{filteredProjects.length !== 1 ? "s" : ""}</span>
          <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-primary hover:underline font-bold">
            <X className="w-3 h-3" />
            Clear filters
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No projects found"
          description={hasFilters ? "Try adjusting your filters." : "No open projects at the moment. Check back soon."}
          action={hasFilters ? { label: "Clear Filters", onClick: clearFilters } : undefined}
        />
      ) : (
        <div className="space-y-3">
          {filteredProjects.map((project) => (
            <Link
              key={project.id}
              href={`/freelancer/project/${project.id}`}
              className="block bg-white border border-border rounded-xl p-5 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-primary transition-colors">{project.title}</h3>
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed font-medium">{project.description}</p>
                  <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                    <span className="flex items-center gap-1 text-slate-900">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      ${project.budget.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-primary" />
                      Proposals pending
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(Number(project.createdAt)).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <StatusBadge status={project.status} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
