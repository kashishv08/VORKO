"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@/src/components/context/ThemeContext";

export default function FreelancerDashboard() {
  const { user } = useUser();
  const { theme } = useTheme();

  const fadeUp = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const stats = [
    { label: "Active Proposals", value: "3" },
    { label: "Active Contracts", value: "2" },
    { label: "This Month", value: "$450" },
    { label: "Total Earnings", value: "$3,200" },
  ];

  const proposals = [
    {
      project: "UI Design System",
      bid: "$500",
      status: "Pending",
      action: "View",
    },
    {
      project: "E-commerce Website",
      bid: "$1,200",
      status: "Submitted",
      action: "Edit",
    },
  ];

  const messages = [
    { name: "Vivaan", text: "Let’s finalize the logo today" },
    { name: "Kashish", text: "Sure, pushing the code soon" },
  ];

  const meetings = [
    {
      title: "Kickoff Call with Vivaan",
      time: "Tomorrow, 10:00 AM",
      icon: "📹",
    },
  ];

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
            <h2 className="text-3xl font-bold">
              Welcome back, {user?.firstName || "Freelancer"} 👋
            </h2>
            <p className="text-sm text-[var(--muted)] mt-1">
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
              <p className="text-sm mt-1 text-[var(--muted)]">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
              <Link
                href="/freelancer/proposals"
                className="text-[var(--primary)] text-sm hover:underline"
              >
                View All
              </Link>
            </div>

            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[var(--muted)] text-xs uppercase tracking-wider">
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
                    whileHover={{
                      background: "rgba(31,125,83,0.06)",
                    }}
                    className="transition-colors"
                  >
                    <td className="py-4 font-medium">{p.project}</td>
                    <td className="py-4">{p.bid}</td>
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
                        {p.action}
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
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
                  href="/freelancer/messages"
                  className="text-[var(--primary)] text-sm hover:underline"
                >
                  View All
                </Link>
              </div>

              <div className="flex flex-col gap-4">
                {messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3"
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-medium"
                      style={{
                        background: "rgba(31,125,83,0.15)",
                        color: "var(--primary)",
                      }}
                    >
                      {msg.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{msg.name}</p>
                      <p className="text-xs text-[var(--muted)]">{msg.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
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
                    <p className="text-xs text-[var(--muted)]">{m.time}</p>
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
