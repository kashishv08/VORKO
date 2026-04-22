"use client";
import { Briefcase, Users, Shield, Zap, Globe, Award } from "lucide-react";
import { StatsBar } from "./StatsBar";
import { FeatureCard } from "./FeatureCard";
import { Hero } from "./Hero";
import RoleCard from "./RoleCard";
import { useUser } from "@clerk/nextjs";

export default function Landing() {
  const { user } = useUser();
  // console.log(user);
  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      <Hero />
      <StatsBar />

      {!user?.publicMetadata.onboardingComplete ? (
        <section className="py-10 px-6" id="how-it-works">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Choose Your Path</h2>
                Whether youre hiring or looking for work, Lancify has you covered
            </div>
            <div className="w-full">
              <RoleCard />
            </div>
          </div>
        </section>
      ) : (
        ""
      )}

      <section className="py-10 px-6 bg-muted/30" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose Lancify?</h2>
            <p className="text-lg text-muted-foreground">
              Everything you need for successful freelancing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 ">
            <FeatureCard
              icon={Shield}
              title="Secure Payments"
              description="Protected transactions with our escrow system ensure safe payments for both parties"
            />
            <FeatureCard
              icon={Zap}
              title="Fast Matching"
              description="Our smart algorithm connects clients with the right freelancers quickly"
            />
            <FeatureCard
              icon={Globe}
              title="Global Reach"
              description="Work with talented professionals from around the world"
            />
            <FeatureCard
              icon={Award}
              title="Quality Assurance"
              description="Verified reviews and ratings help you make informed decisions"
            />
            <FeatureCard
              icon={Briefcase}
              title="Project Management"
              description="Built-in tools to manage milestones, deliverables, and communication"
            />
            <FeatureCard
              icon={Users}
              title="Community Support"
              description="Join a thriving community of professionals and entrepreneurs"
            />
          </div>
        </div>
      </section>
      <footer className="relative border-t border-[var(--border)] bg-[var(--surface-glass)] backdrop-blur-md py-12">
        {/* Soft background gradient glow */}
        <div
          className="absolute inset-0 opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, var(--highlight) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6 text-center flex flex-col items-center gap-6">
          {/* Logo / Brand */}
          <h2
            className="text-2xl font-bold bg-gradient-to-r from-[var(--primary)] via-[var(--highlight)] to-[var(--secondary)]
          bg-clip-text text-transparent tracking-wide"
          >
            Lancify
          </h2>

          {/* Divider line */}
          <div className="h-px w-20 bg-gradient-to-r from-[var(--primary)] to-[var(--highlight)] opacity-60 my-1" />

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-foreground">Lancify</span>. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
