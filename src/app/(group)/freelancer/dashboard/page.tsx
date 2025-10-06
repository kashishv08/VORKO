"use client";
import React from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useTheme } from "@/src/components/context/ThemeContext";

export default function FreelancerDashboard() {
  const { user } = useUser();
  const { theme } = useTheme();

  // Theme-based colors
  const bg = theme === "light" ? "#f9fafb" : "#1f2937"; // page background
  const cardBg = theme === "light" ? "#fff" : "#374151"; // card background
  const textPrimary = theme === "light" ? "#111827" : "#f9fafb"; // main text
  const textSecondary = theme === "light" ? "#6b7280" : "#d1d5db"; // gray text for dark mode
  const btnBg = theme === "light" ? "#ebf8ff" : "#1e3a8a"; // button background
  const btnText = theme === "light" ? "#3b82f6" : "#bfdbfe"; // button text

  return (
    <div className="flex min-h-screen" style={{ background: bg }}>
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold" style={{ color: textPrimary }}>
            Welcome back, {user?.fullName} 👋
          </h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Active Proposals", value: "3" },
            { label: "Active Contracts", value: "2" },
            { label: "This Month", value: "$450" },
            { label: "Total Earnings", value: "$3,200" },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="rounded-xl shadow-sm p-6 text-center"
              style={{ background: cardBg, color: textPrimary }}
            >
              <p className="text-2xl font-bold">{stat.value}</p>
              <p style={{ color: textSecondary }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Proposals */}
          <div
            className="lg:col-span-2 rounded-xl shadow-sm p-6"
            style={{ background: cardBg, color: textPrimary }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-lg font-semibold"
                style={{ color: textPrimary }}
              >
                Active Proposals
              </h3>
              <Link
                href="/freelancer/proposals"
                className="text-blue-600 text-sm hover:underline"
              >
                View All
              </Link>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr>
                  {["Project", "Bid", "Status", "Actions"].map((head) => (
                    <th
                      key={head}
                      className="pb-2"
                      style={{ color: textSecondary }}
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{
                  borderColor: theme === "light" ? "#e5e7eb" : "#4b5563",
                }}
              >
                {[
                  {
                    project: "UI Design System",
                    bid: "$500",
                    status: "Pending",
                    action: "View",
                  },
                  {
                    project: "E-commerce Website",
                    bid: "$1200",
                    status: "Submitted",
                    action: "Edit",
                  },
                ].map((p, idx) => (
                  <tr key={idx} className="text-sm">
                    <td className="py-3" style={{ color: textPrimary }}>
                      {p.project}
                    </td>
                    <td className="py-3" style={{ color: textPrimary }}>
                      {p.bid}
                    </td>
                    <td className="py-3" style={{ color: textPrimary }}>
                      {p.status}
                    </td>
                    <td className="py-3">
                      <button
                        className="px-3 py-1 rounded-md text-sm hover:bg-blue-500 transition"
                        style={{ background: btnBg, color: btnText }}
                      >
                        {p.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Messages Preview */}
            <div
              className="rounded-xl shadow-sm p-6"
              style={{ background: cardBg }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: textPrimary }}
                >
                  Messages
                </h3>
                <Link
                  href="/freelancer/messages"
                  className="text-blue-600 text-sm hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { name: "Vivaan", text: "Let’s finalize the logo today" },
                  { name: "Kashish", text: "Sure, pushing the code soon" },
                ].map((msg, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: theme === "light" ? "#dbeafe" : "#1e40af",
                        color: theme === "light" ? "#1e40af" : "#bfdbfe",
                      }}
                    >
                      {msg.name[0]}
                    </div>
                    <div>
                      <p
                        className="font-medium text-sm"
                        style={{ color: textPrimary }}
                      >
                        {msg.name}
                      </p>
                      <p className="text-xs" style={{ color: textSecondary }}>
                        {msg.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meetings Preview */}
            <div
              className="rounded-xl shadow-sm p-6"
              style={{ background: cardBg }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3
                  className="text-lg font-semibold"
                  style={{ color: textPrimary }}
                >
                  Meetings
                </h3>
                <Link
                  href="/freelancer/meetings"
                  className="text-blue-600 text-sm hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{
                      background: theme === "light" ? "#dbeafe" : "#1e40af",
                      color: theme === "light" ? "#1e40af" : "#bfdbfe",
                    }}
                  >
                    📹
                  </div>
                  <div>
                    <p
                      className="font-medium text-sm"
                      style={{ color: textPrimary }}
                    >
                      Kickoff Call with Vivaan
                    </p>
                    <p className="text-xs" style={{ color: textSecondary }}>
                      Tomorrow, 10:00 AM
                    </p>
                  </div>
                </div>
                <button
                  className="w-full py-2 rounded-lg hover:bg-blue-700 transition"
                  style={{
                    background: theme === "light" ? "#2563eb" : "#1e40af",
                    color: "#fff",
                  }}
                >
                  Join Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
