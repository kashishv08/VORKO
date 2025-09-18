import React from "react";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold">Dashboard</h2>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-sm rounded-xl p-6 text-center">
            <p className="text-2xl font-bold">4</p>
            <p className="text-gray-600">Active Orders</p>
          </div>
          <div className="bg-white shadow-sm rounded-xl p-6 text-center">
            <p className="text-2xl font-bold">12</p>
            <p className="text-gray-600">Completed Orders</p>
          </div>
          <div className="bg-white shadow-sm rounded-xl p-6 text-center">
            <p className="text-2xl font-bold">2</p>
            <p className="text-gray-600">Upcoming Meetings</p>
          </div>
          <div className="bg-white shadow-sm rounded-xl p-6 text-center">
            <p className="text-2xl font-bold">$1,200</p>
            <p className="text-gray-600">Total Spent</p>
          </div>
        </div>

        {/* Content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Active Orders */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Active Orders</h3>
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-600 text-sm">
                  <th className="pb-2">Gig</th>
                  <th className="pb-2">Freelancer</th>
                  <th className="pb-2">Status</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
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
                  <tr key={idx} className="text-sm">
                    <td className="py-3">{order.gig}</td>
                    <td className="py-3 flex items-center gap-2">
                      <img
                        src={`/avatar-${order.freelancer.toLowerCase()}.jpg`}
                        alt={order.freelancer}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      {order.freelancer}
                    </td>
                    <td className="py-3">{order.status}</td>
                    <td className="py-3">
                      <button className="px-3 py-1 rounded-md text-sm bg-blue-50 text-blue-600 hover:bg-blue-100">
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
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Messages</h3>
              <div className="flex flex-col gap-4">
                {[
                  { name: "kashish", text: "Let me know if you need any…" },
                  { name: "Shreya", text: "Sure, I can help with that" },
                  { name: "Aisha", text: "No problem, looking to…" },
                ].map((msg, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <img
                      src={`/avatar-${msg.name.toLowerCase()}.jpg`}
                      alt={msg.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-sm">{msg.name}</p>
                      <p className="text-gray-600 text-xs">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meetings */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Meetings</h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                    📹
                  </div>
                  <div>
                    <p className="font-medium text-sm">
                      Video Call with kashish
                    </p>
                    <p className="text-gray-600 text-xs">Today, 3:00 PM</p>
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
