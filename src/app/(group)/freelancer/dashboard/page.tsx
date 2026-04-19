"use client";

import RecentMessages from "@/src/components/chat/RecentMessages";
import { useTheme } from "@/src/components/context/ThemeContext";
import { EditProfile } from "@/src/components/EditProfile";
import { EARNING_GRAPH, FREELANCER_DASHBOARD } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import type { User } from "@clerk/backend";
import { useUser } from "@clerk/nextjs";
import type { UserResource as ClerkUser } from "@clerk/types";
import { Project, Proposal } from "@prisma/client";
import { Spinner } from "@radix-ui/themes";
import type { Variants } from "framer-motion";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ProjectResponse } from "../../client/project/[id]/page";

type dashboardType = {
  stats: {
    activeProposalsCount: number;
    activeContractsCount: number;
    totalProposalsCount: number;
    totalEarnings: number;
  };
  latestProposals: (Proposal & { project: Project & { client: User } })[];
};

export default function FreelancerDashboard() {
  const { user } = useUser();
  const { theme } = useTheme();
  const [dashboard, setdashboard] = useState<dashboardType>();
  const [proposals, setProposals] = useState<
    (Proposal & { project: Project })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<ClerkUser | null>(
    user ?? null
  );
  // console.log(user);

  const [earningsData, setEarningsData] = useState<
    { month: string; total: number }[]
  >([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      interface EarningsGraphResponse {
        earningsGraph: { month: string; total: number }[];
      }
      const res = await gqlClient.request<EarningsGraphResponse>(EARNING_GRAPH);
      console.log(res);
      setEarningsData(res.earningsGraph);
    };
    fetchEarnings();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data: { freelancerDashboard: dashboardType } =
          await gqlClient.request(FREELANCER_DASHBOARD);
        setdashboard(data?.freelancerDashboard);
        setProposals(data?.freelancerDashboard?.latestProposals);
      } catch (err) {
        console.error("Error loading dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // console.log("dash", dashboard);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const stats = [
    {
      label: "Active Proposals",
      value: `${dashboard?.stats.activeProposalsCount}`,
    },
    {
      label: "Active Contracts",
      value: `${dashboard?.stats.activeContractsCount}`,
    },
    {
      label: "Total Proposals",
      value: `${dashboard?.stats.totalProposalsCount}`,
    },
    { label: "Total Earnings", value: `${dashboard?.stats.totalEarnings}` },
  ];

  const meetings = [
    {
      title: "Kickoff Call with Vivaan",
      time: "Tomorrow, 10:00 AM",
      icon: "📹",
    },
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
      style={{ background: "var(--background)", color: "var(--foreground)" }}
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
            <h2 className="text-3xl font-bold">
              Welcome back, {user?.firstName || "Freelancer"} 👋
            </h2>
            <p className="text-sm text-muted mt-1">
              Here’s what’s happening with your work.
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
                y: -6,
                boxShadow: "0 12px 25px rgba(31,125,83,0.15)",
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

        {/* Row 1: Proposals + Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Active Proposals */}
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
              <h3 className="text-lg font-semibold">Active Proposals</h3>
              {proposals.length !== 0 && (
                <Link
                  href="/freelancer/proposals"
                  className="text-[var(--primary)] text-sm hover:underline"
                >
                  View All
                </Link>
              )}
            </div>


            {proposals.length === 0 ? (
              <p className="text-center text-muted">No active proposals</p>
            ) : (

              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-muted text-xs uppercase tracking-wider">
                    {["Project", "Bid", "Status", "Action"].map((head) => (
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
                  {proposals.map((p, idx) => (
                    <motion.tr
                      key={idx}
                      whileHover={{ background: "rgba(31,125,83,0.06)" }}
                      className="transition-colors"
                    >
                      <td className="py-4 font-medium">{p?.project?.title}</td>
                      <td className="py-4">{p.amount}</td>
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
                          <Link href={`/freelancer/project/${p.project.id}`}>
                            View
                          </Link>
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </motion.section>

          {/* Analytics */}
          <motion.section
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl p-6 flex flex-col gap-6"
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <h3 className="text-lg font-semibold">Analytics</h3>
            <div className="h-40">
              {earningsData.length === 0 ? (
                <p className="text-center text-muted">No analytics data</p>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={earningsData}>
                    <XAxis dataKey="month" stroke="var(--muted)" fontSize={12} />
                    <YAxis stroke="var(--muted)" fontSize={12} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="total"
                      stroke="var(--primary)"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.section>
        </div>

        {/* Row 2: Messages + Meetings + Edit Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                href="/freelancer/chat"
                className="text-[var(--primary)] text-sm hover:underline"
              >
                View All
              </Link>
            </div>
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
                href="/freelancer/meetings"
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

          {/* Edit Profile */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="rounded-xl p-6 flex flex-col items-center justify-center text-center gap-4"
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(255,255,255,0.06)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div>
              <Image
                height={100}
                width={100}
                src={user?.imageUrl || "/user.png"}
                alt="avatar"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
            <h4 className="font-semibold text-lg">
              {currentUser?.fullName || user?.fullName}
            </h4>
            <p className="text-sm text-muted">
              {user?.primaryEmailAddress?.emailAddress ||
                "freelancer@email.com"}
            </p>
            <EditProfile setCurrentUser={setCurrentUser} />
          </motion.div>
        </div>
      </main>
    </div>
  );
}
