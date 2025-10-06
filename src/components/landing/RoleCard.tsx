"use client";
import { Role } from "@prisma/client";
import { Briefcase, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RoleCard() {
  const router = useRouter();
  const handleRole = (role: Role) => {
    router.push(`/sign-up?role=${role}`);
  };
  return (
    <div className="flex gap-10 justify-center items-center">
      {/* Client Card */}
      <div
        className="bg-card rounded-xl p-10 h-[29rem] flex flex-col items-center group transition duration-300 
            hover:shadow-2xl hover:bg-accent border border-border w-[340px] max-w-full"
      >
        <div className="bg-green-100 dark:bg-green-900 rounded-full p-4 mb-4 transition-colors">
          <Briefcase className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Join as Client</h2>
        <p className="mb-4 text-muted-foreground text-center">
          Post projects and hire talented freelancers
        </p>
        <ul className="mb-7 space-y-2 text-left">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Post unlimited projects
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Review freelancer
            proposals
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Secure payment processing
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Real-time communication
          </li>
        </ul>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg 
              transition duration-200 hover:scale-105 focus:outline-none w-full cursor-pointer"
          onClick={() => handleRole("CLIENT")}
        >
          Continue as Client →
        </button>
      </div>

      {/* Freelancer Card */}
      <div
        className="bg-card rounded-xl p-10 h-[29rem] flex flex-col items-center group transition duration-300 
            hover:shadow-2xl hover:bg-accent border border-border w-[340px] max-w-full"
      >
        <div className="bg-green-100 dark:bg-green-900 rounded-full p-4 mb-4 transition-colors">
          <User className="h-10 w-10 text-green-500" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Join as Freelancer</h2>
        <p className="mb-4 text-muted-foreground text-center">
          Discover opportunities and expand your enterprise
        </p>
        <ul className="mb-7 space-y-2 text-left">
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Browse available projects
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Submit competitive
            proposals
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Build your portfolio
          </li>
          <li className="flex items-center gap-2">
            <span className="text-green-500">✓</span> Get paid securely
          </li>
        </ul>
        <button
          className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg 
              transition duration-200 hover:scale-105 focus:outline-none w-full cursor-pointer"
          onClick={() => handleRole("FREELANCER")}
        >
          Continue as Freelancer →
        </button>
      </div>
    </div>
  );
}
