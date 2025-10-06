"use client";
import { Briefcase, Users, Shield, Zap, Globe, Award } from "lucide-react";
import { StatsBar } from "./StatsBar";
import { FeatureCard } from "./FeatureCard";
import { Hero } from "./Hero";
import RoleCard from "./RoleCard";
import { useUser } from "@clerk/nextjs";

export default function Landing() {
  const { user } = useUser();
  console.log(user);
  return (
    <div className="min-h-screen">
      {/* <Header /> */}
      <Hero />
      <StatsBar />

      {!user?.publicMetadata.onboardingComplete ? (
        <section className="py-20 px-6" id="how-it-works">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Choose Your Path</h2>
              <p className="text-lg text-muted-foreground">
                Whether youre hiring or looking for work, VORKO has you covered
              </p>
            </div>
            <div className="w-full">
              <RoleCard />
            </div>
          </div>
        </section>
      ) : (
        ""
      )}

      <section className="py-20 px-6 bg-muted/30" id="features">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose VORKO?</h2>
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

      <footer className="border-t py-12 px-6">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 VORKO. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
