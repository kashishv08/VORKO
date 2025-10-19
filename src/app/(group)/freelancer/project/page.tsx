"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { gqlClient } from "@/src/lib/service/gql";
import { ALL_CLIENTS_PROJECTS } from "@/src/lib/gql/queries";
import { Project } from "@prisma/client";
import { Spinner, Text } from "@radix-ui/themes";

export default function MyProjectsPage() {
  const { user, isLoaded } = useUser();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects after user loads
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (!isLoaded || !user) return;
        const proj: { allClientsProject: Project[] } = await gqlClient.request(
          ALL_CLIENTS_PROJECTS
        );
        const open = (proj.allClientsProject || []).filter(
          (p) => p.status === "OPEN"
        );
        setProjects(open);
      } catch (err) {
        console.error("Error loading projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, isLoaded]);

  const formatDate = (timestamp: number) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (!isLoaded || loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen text-lg"
        style={{ background: "var(--background)", color: "var(--foreground)" }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <div
      className="px-8 py-12 min-h-screen"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex justify-between items-center mb-10"
      >
        <div>
          <h1 className="text-3xl font-bold">All Active Projects</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            Manage and explore projects available for freelancers.
          </p>
        </div>
      </motion.div>

      {/* Projects List */}
      {projects.length > 0 ? (
        <motion.div
          className="grid gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
        >
          {projects.map((project) => {
            const statusColor =
              project.status === "OPEN"
                ? "text-green-500 bg-green-500/10"
                : project.status === "HIRED"
                ? "text-yellow-500 bg-yellow-500/10"
                : "text-gray-400 bg-gray-500/10";

            return (
              <motion.div
                key={project.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{
                  y: -6,
                  scale: 1.01,
                  boxShadow: "0 10px 30px rgba(31,125,83,0.15)",
                }}
                transition={{ type: "spring", stiffness: 150, damping: 12 }}
                className="relative p-6 rounded-2xl border shadow-sm transition-all group overflow-hidden"
                style={{
                  background:
                    "linear-gradient(180deg, var(--surface), rgba(255,255,255,0.06))",
                  borderColor: "rgba(255,255,255,0.08)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Hover Popup */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 z-10 bg-[rgba(0,0,0,0.6)] text-white opacity-0 group-hover:opacity-100 flex flex-col justify-center items-center rounded-2xl backdrop-blur-sm transition"
                >
                  <p className="text-sm font-medium mb-3 text-center px-6">
                    {project.description.length > 120
                      ? project.description.slice(0, 120) + "..."
                      : project.description}
                  </p>
                  <Link
                    href={`/freelancer/project/${project.id}`}
                    className="px-4 py-2 text-sm rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 transition"
                  >
                    View Project
                  </Link>
                </motion.div>

                {/* Main Content */}
                <div className="relative z-0 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-1">
                      {project.title}
                    </h2>
                    <p className="text-sm text-[var(--muted)] line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-2 min-w-[160px]">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor}`}
                    >
                      {project.status}
                    </span>
                    <p className="font-semibold">${project.budget}</p>
                    <p className="text-xs text-[var(--muted)]">
                      {formatDate(Number(project.deadline))}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <Text size="2" className="text-[var(--muted)]">
          No active projects.
        </Text>
      )}
    </div>
  );
}
