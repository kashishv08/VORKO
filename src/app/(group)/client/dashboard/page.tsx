"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useAnimation } from "framer-motion";
import { useTheme } from "@/src/components/context/ThemeContext";
import { gqlClient } from "@/src/lib/service/gql";
import { CLIENT_DASHBOARD } from "@/src/lib/gql/queries";

export default function DashboardPage() {
  const { theme } = useTheme();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const controls = useAnimation();

  const [stats, setStats] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // 🟩 Fetch data from GraphQL
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { clientDashboard } = await gqlClient.request(CLIENT_DASHBOARD);

        const formattedStats = [
          {
            label: "Pending Proposals",
            value: String(clientDashboard.proposalsPendingCount),
          },
          {
            label: "Active Contracts",
            value: String(clientDashboard.activeContractsCount),
          },
          {
            label: "Active Projects",
            value: String(clientDashboard.activeProjects.length),
          },
          { label: "Total Spent", value: "$1,200" }, // static for now
        ];

        // Format active projects into orders table
        const formattedOrders = clientDashboard.activeProjects.map(
          (proj: any) => ({
            gig: proj.title,
            freelancer: "—", // placeholder for now
            status: proj.status,
            action: "View",
          })
        );

        setStats(formattedStats);
        setOrders(formattedOrders);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
      }
    };

    fetchData();
  }, []);

  // Animation trigger
  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  // Micro parallax
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    function onMove(e: PointerEvent) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      el.style.setProperty("--px", String(dx.toFixed(3)));
      el.style.setProperty("--py", String(dy.toFixed(3)));
    }
    function onLeave() {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    }
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Framer motion variants
  const containerVariant = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" },
    },
  };

  // Static messages (for now)
  const messages = [
    { name: "kashish", text: "Let me know if you need any…" },
    { name: "Shreya", text: "Sure, I can help with that" },
    { name: "Aisha", text: "No problem, looking to…" },
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <main className="flex-1 p-8">
        {/* Topbar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-sm text-[var(--muted)]">
              Welcome back — here’s your activity.
            </p>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          ref={containerRef}
          variants={containerVariant}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          style={{ perspective: 800 }}
        >
          {stats.map((s, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{
                translateY: -8,
                boxShadow: "0 18px 40px rgba(31,125,83,0.12)",
              }}
              className="rounded-xl p-6 text-center cursor-default transform-gpu transition-transform"
              style={{
                background: "var(--surface)",
                color: "var(--foreground)",
                transform: `translate3d(calc(var(--px,0) * ${
                  6 * (i - 1)
                }px), calc(var(--py,0) * ${6 * (i - 1)}px), 0)`,
                border: "1px solid rgba(255,255,255,0.03)",
                backdropFilter: "blur(6px)",
              }}
            >
              <p className="text-2xl font-semibold">{s.value}</p>
              <p className="text-sm text-[var(--muted)] mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Orders (left, spans 2) */}
          <motion.section
            initial="hidden"
            animate="visible"
            variants={containerVariant}
            className="lg:col-span-2 rounded-xl p-6"
            style={{
              background: "var(--surface)",
              color: "var(--foreground)",
              border: "1px solid rgba(255,255,255,0.04)",
              backdropFilter: "blur(6px)",
            }}
          >
            <motion.h3 variants={fadeUp} className="text-lg font-semibold mb-4">
              Active Projects
            </motion.h3>

            <div className="w-full overflow-hidden rounded-md">
              <table className="w-full text-left">
                <thead>
                  <tr>
                    <th className="pb-3 text-xs uppercase tracking-wide text-[var(--muted)]">
                      Project
                    </th>
                    <th className="pb-3 text-xs uppercase tracking-wide text-[var(--muted)]">
                      Status
                    </th>
                    <th className="pb-3 text-xs uppercase tracking-wide text-[var(--muted)]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  className="divide-y"
                  style={{ borderColor: "rgba(255,255,255,0.03)" }}
                >
                  {orders.map((o, idx) => (
                    <motion.tr
                      key={idx}
                      variants={fadeUp}
                      whileHover={{ scale: 1.01 }}
                      className="group"
                      style={{ transition: "transform 180ms ease" }}
                    >
                      <td className="py-4">{o.gig}</td>
                      <td className="py-4">
                        <span
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium"
                          style={{
                            background:
                              o.status === "OPEN"
                                ? "rgba(31,125,83,0.08)"
                                : "rgba(125,125,125,0.06)",
                            color:
                              o.status === "OPEN"
                                ? "var(--primary)"
                                : "var(--muted)",
                            border: "1px solid rgba(255,255,255,0.02)",
                          }}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          className="px-3 py-1 rounded-md text-sm font-medium"
                          style={{
                            background: "var(--primary)",
                            color: "white",
                            boxShadow: "0 8px 24px rgba(31,125,83,0.12)",
                          }}
                        >
                          {o.action}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>

          {/* Right column — Messages and Meetings remain static for now */}
          <div className="flex flex-col gap-6">
            {/* Messages */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="rounded-xl p-6"
              style={{
                background: "var(--surface)",
                color: "var(--foreground)",
                border: "1px solid rgba(255,255,255,0.04)",
                backdropFilter: "blur(6px)",
              }}
            >
              <h3 className="text-lg font-semibold mb-4">Messages</h3>
              <div className="flex flex-col gap-4">
                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ x: 6 }}
                    className="flex items-center gap-3"
                    style={{ transition: "transform 180ms ease" }}
                  >
                    <Image
                      height={100}
                      width={100}
                      src={`/avatar-${m.name.toLowerCase()}.jpg`}
                      alt={m.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">{m.name}</p>
                      <p className="text-xs text-[var(--muted)]">{m.text}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Meetings */}
            <motion.div
              variants={fadeUp}
              className="rounded-xl p-6 flex flex-col gap-4"
              style={{
                background: "var(--surface)",
                color: "var(--foreground)",
                border: "1px solid rgba(255,255,255,0.04)",
                backdropFilter: "blur(6px)",
              }}
            >
              <h3 className="text-lg font-semibold">Meetings</h3>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-lg"
                  style={{
                    background: "var(--accent)",
                    color: "white",
                  }}
                >
                  📹
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">Video Call with kashish</p>
                  <p className="text-xs text-[var(--muted)]">Today, 3:00 PM</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                className="w-full py-2 rounded-lg font-medium"
                style={{
                  background:
                    "linear-gradient(90deg, var(--primary), var(--accent))",
                  color: "white",
                  boxShadow: "0 12px 30px rgba(31,125,83,0.12)",
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
