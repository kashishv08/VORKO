"use client";

import AddProject from "@/src/components/client/addProject";
import { CLIENT_PROJ } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { Project } from "@prisma/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import ClientContractsPage from "../contract/page";
import { Spinner } from "@radix-ui/themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/src/components/ui/tabs";

type TabType = "active" | "posted" | "contracts";

export default function MyProjectsPage() {
  const { isLoaded, userId } = useAuth();
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [allProj, setAllProj] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("active");

  useEffect(() => {
    if (!isLoaded || !userId) return;

    const fetchProj = async () => {
      setLoading(true);
      try {
        const proj: { clientAllPostedProjects: Project[] } =
          await gqlClient.request(CLIENT_PROJ, { id: userId });

        const all = proj.clientAllPostedProjects || [];
        setAllProj(all);
        const active = all.filter(
          (p) => p.status === "OPEN" || p.status === "HIRED"
        );
        setActiveProjects(active);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
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
        ? "bg-green-200 text-green-800 dark:bg-green-900/20 dark:text-green-300"
        : project.status === "HIRED"
        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
        : "bg-gray-100 text-gray-700 dark:bg-gray-800/20 dark:text-gray-300";

    return (
      <motion.div
        key={project.id}
        layout
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{
          y: -5,
          scale: 1.02,
          boxShadow: "0 10px 30px rgba(31,125,83,0.2)",
        }}
        transition={{ type: "spring", stiffness: 150, damping: 14 }}
        className="relative w-full flex flex-col md:flex-row justify-between gap-6 p-6 rounded-2xl border border-border bg-surfaceGlass backdrop-blur-lg overflow-hidden cursor-pointer mt-8 mb-8 transition-all"
      >
        {/* Hover Popup Overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 z-10 bg-black/60 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center rounded-2xl transition-all"
        >
          <p className="text-sm font-medium text-center px-6 mb-4">
            {project.description.length > 120
              ? project.description.slice(0, 120) + "..."
              : project.description}
          </p>
          <Link
            href={`/client/project/${project.id}`}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition"
          >
            View Project
          </Link>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 relative z-0">
          <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold rounded-full bg-surface text-muted">
            General
          </span>
          <h2 className="text-lg font-bold text-foreground">{project.title}</h2>
          <p className="text-sm text-muted mt-1 line-clamp-2">
            {project.description}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end justify-between min-w-[220px] mt-4 md:mt-0 gap-4 relative z-0">
          <div className="flex flex-col items-start md:items-end gap-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyle}`}
            >
              {project.status}
            </span>
            <p className="font-bold text-primary mt-2">${project.budget}</p>
            <p className="text-sm text-muted">
              {formatDate(Number(project.deadline))}
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="px-6 md:px-12 py-10 w-full max-w-6xl mx-auto bg-background">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <h1 className="text-3xl font-extrabold text-foreground hero-gradient bg-clip-text text-transparent animate-slow-pan">
          Projects
        </h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <AddProject
            setActiveProject={setActiveProjects}
            setAllProj={setAllProj}
          />
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(val) => setActiveTab(val as TabType)}
        className="w-full"
      >
        <TabsList className="flex gap-4 mb-8 rounded-xl bg-surfaceGlass p-2 shadow">
          {["active", "posted", "contracts"].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="cursor-pointer tabs-trigger flex-1 py-3 font-semibold text-sm sm:text-base rounded-lg transition-transform duration-300 hover:scale-104"
            >
              {tab === "active"
                ? "My Projects"
                : tab === "posted"
                ? "Posted Projects"
                : "Active Contracts"}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Active Projects */}
        <TabsContent value="active">
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="3" />
            </div>
          ) : activeProjects.length ? (
            <AnimatePresence>
              {activeProjects.map(renderProjectCard)}
            </AnimatePresence>
          ) : (
            <p className="text-center text-muted">No projects found.</p>
          )}
        </TabsContent>

        {/* Posted Projects */}
        <TabsContent value="posted">
          {loading ? (
            <div className="flex justify-center py-20">
              <Spinner size="3" />
            </div>
          ) : allProj.length ? (
            <AnimatePresence>{allProj.map(renderProjectCard)}</AnimatePresence>
          ) : (
            <p className="text-center text-muted">No projects found.</p>
          )}
        </TabsContent>

        {/* Contracts */}
        <TabsContent value="contracts">
          <ClientContractsPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
