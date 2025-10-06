"use client";
import React from "react";
import { useTheme } from "@/src/components/context/ThemeContext";
import Image from "next/image";

export default function Page() {
  const { theme } = useTheme();

  // Helper colors
  const bg = theme === "light" ? "#f9fafb" : "#1f2937";
  const cardBg = theme === "light" ? "#fff" : "#374151";
  const textPrimary = theme === "light" ? "#111827" : "#f9fafb";
  const textSecondary = theme === "light" ? "#6b7280" : "#d1d5db"; // gray-400/light gray for dark mode
  const btnBg = theme === "light" ? "#ebf8ff" : "#1e3a8a";
  const btnText = theme === "light" ? "#3b82f6" : "#bfdbfe";

  return (
    <div className="flex min-h-screen" style={{ background: bg }}>
      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold" style={{ color: textPrimary }}>
            Dashboard
          </h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: "Active Orders", value: "4" },
            { label: "Completed Orders", value: "12" },
            { label: "Upcoming Meetings", value: "2" },
            { label: "Total Spent", value: "$1,200" },
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

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Orders */}
          <div
            className="lg:col-span-2 rounded-xl shadow-sm p-6"
            style={{ background: cardBg, color: textPrimary }}
          >
            <h3
              className="text-lg font-semibold mb-4"
              style={{ color: textPrimary }}
            >
              Active Orders
            </h3>
            <table className="w-full text-left">
              <thead>
                <tr>
                  <th className="pb-2" style={{ color: textSecondary }}>
                    Gig
                  </th>
                  <th className="pb-2" style={{ color: textSecondary }}>
                    Freelancer
                  </th>
                  <th className="pb-2" style={{ color: textSecondary }}>
                    Status
                  </th>
                  <th className="pb-2" style={{ color: textSecondary }}>
                    Actions
                  </th>
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
                    gig: "Design a logo",
                    freelancer: "kashish",
                    status: "Pending",
                    action: "View",
                  },
                  {
                    gig: "Build a website",
                    freelancer: "Shreya",
                    status: "In Progress",
                    action: "Chat",
                  },
                  {
                    gig: "Content writing",
                    freelancer: "Aisha",
                    status: "Delivered",
                    action: "View",
                  },
                ].map((order, idx) => (
                  <tr key={idx}>
                    <td className="py-3">{order.gig}</td>
                    <td className="py-3 flex items-center gap-2">
                      <Image
                        height={100}
                        width={100}
                        src={`/avatar-${order.freelancer.toLowerCase()}.jpg`}
                        alt={order.freelancer}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span style={{ color: textPrimary }}>
                        {order.freelancer}
                      </span>
                    </td>
                    <td className="py-3" style={{ color: textPrimary }}>
                      {order.status}
                    </td>
                    <td className="py-3">
                      <button
                        className="px-3 py-1 rounded-md text-sm hover:bg-blue-500 transition"
                        style={{ background: btnBg, color: btnText }}
                      >
                        {order.action}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Messages */}
            <div
              className="rounded-xl shadow-sm p-6"
              style={{ background: cardBg }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: textPrimary }}
              >
                Messages
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  { name: "kashish", text: "Let me know if you need any…" },
                  { name: "Shreya", text: "Sure, I can help with that" },
                  { name: "Aisha", text: "No problem, looking to…" },
                ].map((msg, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Image
                      height={100}
                      width={100}
                      src={`/avatar-${msg.name.toLowerCase()}.jpg`}
                      alt={msg.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
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

            {/* Meetings */}
            <div
              className="rounded-xl shadow-sm p-6"
              style={{ background: cardBg }}
            >
              <h3
                className="text-lg font-semibold mb-4"
                style={{ color: textPrimary }}
              >
                Meetings
              </h3>
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
                      Video Call with kashish
                    </p>
                    <p className="text-xs" style={{ color: textSecondary }}>
                      Today, 3:00 PM
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
