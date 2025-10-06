"use client";

import AddProject from "@/src/components/client/addProject";
import { CLIENT_PROJ } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { Project } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import * as Tabs from "@radix-ui/react-tabs";
import ClientContractsPage from "../contract/page";

type TabValue = "active" | "posted" | "contracts";

export default function MyProjectsPage() {
  const { isLoaded, userId } = useAuth();
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [allProj, setAllProj] = useState<Project[]>([]);

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const fetchProj = async () => {
      const proj: { clientAllPostedProjects: Project[] } =
        await gqlClient.request(CLIENT_PROJ, { id: userId });

      const all = proj.clientAllPostedProjects || [];
      setAllProj(all);

      const active = all.filter(
        (p) => p.status === "OPEN" || p.status === "HIRED"
      );
      setActiveProjects(active);
    };

    fetchProj();
  }, [isLoaded, userId]);

  const formatDate = (deadline?: number | null) => {
    if (!deadline) return "-";
    return new Date(Number(deadline)).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderProjectCard = (project: Project) => {
    const statusStyle =
      project.status === "OPEN"
        ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
        : project.status === "HIRED"
        ? "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
        : "bg-gray-50 text-gray-600 dark:bg-gray-800/20 dark:text-gray-300";

    return (
      <div
        key={project.id}
        className="w-full mr-6 mt-6 mb-6 flex flex-col md:flex-row justify-between gap-6 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition hover:shadow-md"
      >
        {/* Left */}
        <div className="flex-1">
          <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
            General
          </span>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            {project.title}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
            {project.description}
          </p>
        </div>

        {/* Right */}
        <div className="flex flex-col items-start md:items-end justify-between min-w-[220px] mt-4 md:mt-0">
          <div className="flex flex-col items-start md:items-end gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}
            >
              {project.status}
            </span>
            <p className="font-bold text-green-600 dark:text-green-400 mt-2">
              ${project.budget}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(Number(project.deadline))}
            </p>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {0} proposals
            </p>
            <Link
              href={`/client/project/${project.id}`}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium border border-green-600 dark:border-green-400 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-800/40 transition"
            >
              View
            </Link>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="px-6 md:px-12 py-10 w-full max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          My Projects
        </h1>
        <AddProject
          setActiveProject={setActiveProjects}
          setAllProj={setAllProj}
        />
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="active" className="w-full">
        <Tabs.List className="flex gap-2 border-b border-gray-300 dark:border-gray-700 mb-8 overflow-x-auto">
          {["active", "posted", "contracts"].map((tab) => (
            <Tabs.Trigger
              key={tab}
              value={tab as TabValue}
              className="
                px-5 py-3 text-sm font-medium rounded-t-lg transition-colors
                data-[state=active]:bg-green-600 data-[state=active]:text-white
                data-[state=inactive]:bg-gray-100 dark:data-[state=inactive]:bg-gray-800
                data-[state=inactive]:text-gray-600 dark:data-[state=inactive]:text-gray-300
                hover:data-[state=inactive]:bg-green-50 dark:hover:data-[state=inactive]:bg-green-900/30
                whitespace-nowrap
              "
            >
              {tab === "active"
                ? "My Projects"
                : tab === "posted"
                ? "Posted Projects"
                : "Active Contracts"}
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="space-y-6">
          <Tabs.Content value="active">
            {activeProjects.length > 0 ? (
              activeProjects.map(renderProjectCard)
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No projects found.
              </p>
            )}
          </Tabs.Content>

          <Tabs.Content value="posted">
            {allProj.length > 0 ? (
              allProj.map(renderProjectCard)
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400">
                No projects found.
              </p>
            )}
          </Tabs.Content>

          <Tabs.Content value="contracts">
            <ClientContractsPage />
          </Tabs.Content>
        </div>
      </Tabs.Root>
    </div>
  );
}
