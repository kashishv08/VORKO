"use client";

import { Role } from "@prisma/client";
import { Briefcase, User, Check, ArrowRight, Shield, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default function RoleCard() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  const handleRole = async (role: Role) => {
    if (!isLoaded) return;

    if (user) {
      try {
        const response = await axios.post("/api/check-role", {
          clerkId: user.id,
          role: role,
          email: user.emailAddresses[0].emailAddress,
          name: user.fullName || user.username || "User",
        });

        if (response.data.success) {
          router.push(`/onboarding?role=${role}`);
        }
      } catch (err) {
        console.error("Error setting role:", err);
      }
    } else {
      router.push(`/sign-up?role=${role}`);
    }
  };

  const roles = [
    {
      title: "I want to Hire",
      subtitle: "Launch projects and find talent.",
      icon: Briefcase,
      description: "Post projects and discover world-class freelancers to help you scale your vision.",
      features: [
        "Post high-impact projects",
        "Review curated professional bids",
        "Secured escrow payments",
        "Dedicated project management hub",
      ],
      role: "CLIENT" as Role,
      accent: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "I want to Work",
      subtitle: "Find opportunities and grow.",
      icon: User,
      description: "Discover high-paying projects that match your expertise and expand your client base.",
      features: [
        "Browse exclusive project listings",
        "Build a verified professional profile",
        "Guaranteed payment protection",
        "Instant communication with clients",
      ],
      role: "FREELANCER" as Role,
      accent: "text-emerald-500",
      bg: "bg-emerald-50",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl mx-auto items-stretch">
      {roles.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex-1"
        >
          <div
            className={`group relative h-full flex flex-col bg-white border border-border rounded-[2.5rem] p-10 hover:shadow-2xl hover:border-primary/20 transition-all duration-500 cursor-default overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700" />

            <div className="flex items-center justify-between mb-8">
              <div className={`w-16 h-16 rounded-[1.5rem] ${card.bg} flex items-center justify-center ${card.accent} shadow-sm border border-black/5 group-hover:scale-110 transition-transform`}>
                <card.icon size={32} />
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest px-3 py-1 bg-slate-50 rounded-full border border-slate-100">
                <Shield size={12} />
                Verified Account
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-black text-slate-900 mb-2">{card.title}</h2>
              <p className="text-lg font-bold text-primary">{card.subtitle}</p>
            </div>

            <p className="text-slate-500 font-medium leading-relaxed mb-8 flex-1">
              {card.description}
            </p>

            <div className="space-y-4 mb-10">
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Platform Benefits</p>
              {card.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Check size={12} strokeWidth={4} />
                  </div>
                  <span className="text-sm font-bold text-slate-600">{feature}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleRole(card.role)}
              className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-primary transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary/20 flex items-center justify-center gap-2 group/btn transform active:scale-95"
            >
              Get Started
              <ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
