"use client";

import { Role } from "@prisma/client";
import { Briefcase, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function RoleCard() {
  const router = useRouter();

  const handleRole = (role: Role) => {
    router.push(`/sign-up?role=${role}`);
  };

  const roles = [
    {
      title: "Join as Client",
      icon: Briefcase,
      description: "Post projects and hire talented freelancers.",
      features: [
        "Post unlimited projects",
        "Review freelancer proposals",
        "Secure payment processing",
        "Real-time communication",
      ],
      role: "CLIENT" as Role,
    },
    {
      title: "Join as Freelancer",
      icon: User,
      description: "Discover opportunities and expand your enterprise.",
      features: [
        "Browse available projects",
        "Submit competitive proposals",
        "Build your portfolio",
        "Get paid securely",
      ],
      role: "FREELANCER" as Role,
    },
  ];

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Soft background glow */}
      <div
        className="absolute inset-0 blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, var(--highlight) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-5 max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-10 justify-center items-center">
        {roles.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className={`
              group relative w-full max-w-sm
              bg-[var(--surface-glass)]
              border border-[var(--border)]
              rounded-2xl
              p-10
              text-center
              shadow-[0_8px_25px_var(--shadow)]
              backdrop-blur-md
              transition-all duration-500
              hover:shadow-[0_12px_40px_var(--shadow)]
              hover:translate-y-[-6px]
              hover:border-[var(--highlight)]
            `}
          >
            {/* Animated background glow */}
            <div
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-all duration-700"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--highlight), var(--secondary))",
                filter: "blur(20px)",
              }}
            />

            {/* Icon container */}
            <div
              className="relative mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl 
                bg-gradient-to-br from-[var(--primary)] to-[var(--highlight)]
                shadow-[0_4px_16px_rgba(46,163,111,0.25)]
                text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
            >
              <card.icon className="h-8 w-8" />
            </div>

            {/* Title */}
            <h2
              className="text-2xl font-semibold mb-3 
              bg-gradient-to-r from-[var(--primary)] via-[var(--highlight)] to-[var(--secondary)]
              bg-clip-text text-transparent"
            >
              {card.title}
            </h2>

            {/* Description */}
            <p className="text-sm text-muted mb-6">{card.description}</p>

            {/* Feature list */}
            <ul className="text-left space-y-2 mb-8">
              {card.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-foreground">
                  <span className="text-[var(--highlight)] font-bold">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              onClick={() => handleRole(card.role)}
              className="relative w-full py-3 rounded-xl font-semibold
                text-white text-base
                bg-gradient-to-r from-[var(--primary)] via-[var(--highlight)] to-[var(--secondary)]
                shadow-[0_6px_20px_rgba(46,163,111,0.4)]
                transition-all duration-300
                hover:shadow-[0_10px_35px_rgba(46,163,111,0.5)]
                hover:translate-y-[-2px]
                active:scale-95
                focus:outline-none
              "
            >
              Continue as {card.role === "CLIENT" ? "Client" : "Freelancer"} →
            </button>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
