// import Image from "next/image";
// import React from "react";
// import { MdOutlineRemoveRedEye } from "react-icons/md";

// const proposals = [
//   {
//     id: 1,
//     name: "Daphne Robertson",
//     cover:
//       "I have extensive experience in SaaS web design and can create a modern homepage that meets your requirements.",
//     amount: "$500",
//     status: "ACCEPTED",
//     avatar: "https://i.pravatar.cc/100?img=47",
//   },
//   {
//     id: 2,
//     name: "Mark Thompson",
//     cover:
//       "I am a UI/UX designer with a focus on responsive and user-friendly interfaces.",
//     amount: "$450",
//     status: "REJECTED",
//     avatar: "https://i.pravatar.cc/100?img=12",
//   },
//   {
//     id: 3,
//     name: "Alicia Williams",
//     cover:
//       "I will create a clean, visually appealing, and responsive website that highlights your SaaS product.",
//     amount: "$600",
//     status: "SUBMITTED",
//     avatar: "https://i.pravatar.cc/100?img=32",
//   },
// ];

// const statusConfig = {
//   ACCEPTED: "bg-green-100 text-green-800",
//   REJECTED: "bg-red-100 text-red-800",
//   SUBMITTED: "bg-gray-100 text-gray-800",
// };

// export default function ProposalsPage() {
//   return (
//     <div className="min-h-screen bg-white px-4 sm:px-8 py-6 text-sm">
//       {/* Proposals Table */}
//       <div className="bg-white border rounded-lg shadow-sm p-4 sm:p-6 overflow-x-auto">
//         <h2 className="text-lg font-semibold mb-4">All Proposals</h2>

//         <table className="w-full text-left border-collapse table-fixed">
//           <thead>
//             <tr className="text-gray-600 text-sm">
//               <th className="pb-3 font-medium w-48">Freelancer</th>
//               <th className="pb-3 font-medium">Cover letter</th>
//               <th className="pb-3 font-medium w-24">Amount</th>
//               <th className="pb-3 font-medium w-28 px-4">Status</th>
//               <th className="pb-3 w-36"></th>
//             </tr>
//           </thead>
//           <tbody>
//             {proposals.map((p, idx) => (
//               <tr
//                 key={p.id}
//                 className={idx !== proposals.length - 1 ? "border-b" : ""}
//               >
//                 {/* Freelancer */}
//                 <td className="py-4">
//                   <div className="flex items-center gap-3">
//                     <Image
//                       height={100}
//                       width={100}
//                       src={p.avatar}
//                       alt={p.name}
//                       className="w-10 h-10 rounded-full"
//                     />
//                     <span className="font-medium">{p.name}</span>
//                   </div>
//                 </td>

//                 {/* Cover Letter */}
//                 <td className="py-4 text-gray-700 ">
//                   <p>{p.cover.split(" ").slice(0, 6).join(" ")}</p>
//                   <p className="text-gray-500">
//                     {p.cover.split(" ").slice(10).join(" ")}...
//                   </p>
//                 </td>

//                 {/* Amount */}
//                 <td className="py-4 font-medium">{p.amount}</td>

//                 {/* Status */}
//                 <td className="py-4">
//                   {/* <span
//                     className={`px-4 py-1 rounded-full text-xs font-medium ${
//                       statusConfig[p.status]
//                     }`}
//                   >
//                     {p.status}
//                   </span> */}
//                 </td>

//                 {/* View Button */}
//                 <td className="py-4">
//                   <button className="bg-blue-900 border text-black px-2 rounded-md text-sm font-medium inline-flex justify-center items-center">
//                     <MdOutlineRemoveRedEye />
//                     View
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }

export default function ProposalsPage() {
  return <p>Underworking</p>;
}
