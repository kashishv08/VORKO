import React from "react";
import Link from "next/link";

export default function FreelancerDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Welcome back, Kashish 👋</h2>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-sm rounded-xl p-6 text-center">
            <p className="text-2xl font-bold">3</p>
            <p className="text-gray-600">Active Proposals</p>
          </div>
          <div className="bg-white shadow-sm rounded-xl p-6 text-center">
            <p className="text-2xl font-bold">2</p>
            <p className="text-gray-600">Active Contracts</p>
          </div>
          <div className="bg-white shadow-sm rounded-xl p-6 text-center">
            <p className="text-2xl font-bold">$450</p>
            <p className="text-gray-600">This Month</p>
          </div>
          <div className="bg-white shadow-sm rounded-xl p-6 text-center">
            <p className="text-2xl font-bold">$3,200</p>
            <p className="text-gray-600">Total Earnings</p>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Proposals */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Active Proposals</h3>
              <Link
                href="/freelancer/proposals"
                className="text-blue-600 text-sm hover:underline"
              >
                View All
              </Link>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-600 text-sm">
                  <th className="pb-2">Project</th>
                  <th className="pb-2">Bid</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
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
                    <td className="py-3">{p.project}</td>
                    <td className="py-3">{p.bid}</td>
                    <td className="py-3">{p.status}</td>
                    <td className="py-3">
                      <button className="px-3 py-1 rounded-md text-sm bg-blue-50 text-blue-600 hover:bg-blue-100">
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
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Messages</h3>
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
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                      {msg.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{msg.name}</p>
                      <p className="text-gray-600 text-xs">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meetings Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Meetings</h3>
                <Link
                  href="/freelancer/meetings"
                  className="text-blue-600 text-sm hover:underline"
                >
                  View All
                </Link>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    📹
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Kickoff Call with Vivaan
                    </p>
                    <p className="text-gray-600 text-xs">Tomorrow, 10:00 AM</p>
                  </div>
                </div>
                <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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
