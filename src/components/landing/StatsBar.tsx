"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

export function StatsBar() {
  const stats = [
    { label: "Projects Completed", value: 10000, suffix: "+" },
    { label: "Active Freelancers", value: 5000, suffix: "+" },
    { label: "Happy Clients", value: 3000, suffix: "+" },
    { label: "Success Rate", value: 98, suffix: "%" },
  ];

  return (
    <section
      className="
        relative py-10
        bg-[var(--surface)] 
        text-foreground 
        overflow-hidden
      "
    >
      {/* Decorative animated glow */}
      <div
        className="absolute inset-0 opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, var(--highlight) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Animated value */}
              <div
                className="
                  text-4xl md:text-5xl font-bold mb-2
                  bg-gradient-to-r from-[var(--primary)] via-[var(--highlight)] to-[var(--secondary)]
                  bg-clip-text text-transparent
                  drop-shadow-sm
                "
                data-testid={`text-stat-value-${index}`}
              >
                <CountUp
                  end={stat.value}
                  duration={2.5}
                  enableScrollSpy
                  scrollSpyOnce
                />
                {stat.suffix}
              </div>

              {/* Label */}
              <div
                className="text-sm md:text-base text-muted font-medium tracking-wide"
                data-testid={`text-stat-label-${index}`}
              >
                {stat.label}
              </div>

              {/* Accent underline */}
              <div
                className="
                  mx-auto mt-3 w-8 h-[2px] rounded-full
                  bg-gradient-to-r from-[var(--primary)] to-[var(--highlight)]
                "
              ></div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
