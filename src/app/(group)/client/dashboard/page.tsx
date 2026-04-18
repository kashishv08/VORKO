"use client";

import { useTheme } from "@/src/components/context/ThemeContext";
import { CLIENT_DASHBOARD, EARNING_GRAPH } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Variants } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import RecentMessages from "@/src/components/chat/RecentMessages";
import { Spinner } from "@radix-ui/themes";

type states = {
  label: string;
  value: number | string;
};

type dashboard = {
  activeContractsCount: number;
  proposalsPendingCount: number;
  activeProjects: {
    budget: number;
    createdAt: string;
    deadline: string;
    description: string;
    id: string;
    status: string;
    title: string;
  }[];
  totalspent: number;
};

type ProjectDisplay = {
  id: string;
  title: string;
  status: string;
  action: string;
};

export default function ClientDashboardPage() {
  const { theme } = useTheme();
  const [stats, setStats] = useState<states[]>([]);
  const [projects, setProjects] = useState<ProjectDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  // console.log(user);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: ["easeOut"] },
    },
  };

  // Fetch GraphQL data
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data: { clientDashboard: dashboard } = await gqlClient.request(
          CLIENT_DASHBOARD
        );
        console.log(data.clientDashboard);

        const formattedStats = [
          {
            label: "Pending Proposals",
            value: data.clientDashboard.proposalsPendingCount,
          },
          {
            label: "Active Contracts",
            value: data.clientDashboard.activeContractsCount,
          },
          {
            label: "Active Projects",
            value: data.clientDashboard.activeProjects.length,
          },
          { label: "Total Spent", value: `${data.clientDashboard.totalspent}` },
        ];

        const formattedProjects = data.clientDashboard.activeProjects.map(
          (p) => ({
            id: p.id,
            title: p.title,
            status: p.status,
            action: "View",
          })
        );

        setStats(formattedStats);
        setProjects(formattedProjects);
      } catch (error) {
        console.error("Error fetching client dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const meetings = [
    { title: "Design Review Call", time: "Today, 3:00 PM", icon: "📹" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="3" />
      </div>
    );
  }

  return (
    <div
      className="flex min-h-screen"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <main className="flex-1 p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-between items-center mb-10"
        >
          <div>
            <h2 className="text-3xl font-bold">Welcome back, Client 👋</h2>
            <p className="text-sm text-muted mt-1">
              Here’s an overview of your activity.
            </p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{
                y: -8,
                boxShadow: "0 12px 30px rgba(31,125,83,0.15)",
              }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="rounded-xl p-6 text-center transform-gpu"
              style={{
                background:
                  theme === "light"
                    ? "linear-gradient(180deg, var(--surface), rgba(255,255,255,0.9))"
                    : "linear-gradient(180deg, var(--surface), rgba(31,31,31,0.8))",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
              }}
            >
              <p className="text-3xl font-semibold text-[var(--primary)]">
                {stat.value}
              </p>
              <p className="text-sm mt-1 text-muted">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Projects Section */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 rounded-xl p-6"
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Active Projects</h3>
              <Link
                href="/client/project"
                className="text-[var(--primary)] text-sm hover:underline"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <p className="text-sm text-muted">Loading projects...</p>
            ) : projects.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-muted text-xs uppercase tracking-wider">
                    {["Project", "Status", "Action"].map((head) => (
                      <th key={head} className="pb-3">
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody
                  className="divide-y"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  {projects.map((p, idx) => (
                    <motion.tr
                      key={idx}
                      whileHover={{ background: "rgba(31,125,83,0.06)" }}
                      className="transition-colors"
                    >
                      <td className="py-4 font-medium">{p.title}</td>
                      <td className="py-4">{p.status}</td>
                      <td className="py-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          className="px-3 py-1 rounded-md text-sm font-medium"
                          style={{
                            background:
                              "linear-gradient(90deg, var(--primary), var(--accent))",
                            color: "#fff",
                          }}
                        >
                          <Link
                            href={`/client/project/${p.id}`}
                            className="cursor-pointer"
                          >
                            {p.action}
                          </Link>
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-muted">No active projects found.</p>
            )}
          </motion.section>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Messages */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="rounded-xl p-6"
              style={{
                background: "var(--surface)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Messages</h3>
                <Link
                  href="/client/chat"
                  className="text-[var(--primary)] text-sm hover:underline"
                >
                  View All
                </Link>
              </div>
              {/* recent chats compo */}
              <RecentMessages />
            </motion.div>

            {/* Meetings */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="rounded-xl p-6 flex flex-col gap-4"
              style={{
                background: "var(--surface)",
                border: "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Meetings</h3>
                <Link
                  href="/client/meetings"
                  className="text-[var(--primary)] text-sm hover:underline"
                >
                  View All
                </Link>
              </div>

              {meetings.map((m, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: "var(--accent)",
                      color: "#fff",
                    }}
                  >
                    {m.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{m.title}</p>
                    <p className="text-xs text-muted">{m.time}</p>
                  </div>
                </div>
              ))}

              <motion.button
                whileHover={{ scale: 1.03 }}
                className="w-full py-2 rounded-lg font-medium shadow-md"
                style={{
                  background:
                    "linear-gradient(90deg, var(--primary), var(--accent))",
                  color: "#fff",
                }}
              >
                Join Meeting
              </motion.button>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
