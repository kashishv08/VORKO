"use client";
import RoleCard from "@/src/components/landing/RoleCard";
import { Briefcase, User } from "lucide-react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { toast } from "sonner";

export default function JoinVorko() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Only show if user is logged in but has no role yet
    if (isLoaded && user && !user.publicMetadata.role) {
      toast.message("Signed in successfully", {
        description: "Please select a role to complete your profile.",
      });
    }
  }, [isLoaded, user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors overflow-hidden">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--primary)] via-[var(--highlight)] to-[var(--secondary)] bg-clip-text text-transparent mb-4">
          Join VORKO
        </h1>
        <p className="text-lg text-muted-foreground">
          Choose how you want to use the platform
        </p>
      </div>

      <div className="flex gap-10 flex-col md:flex-row">
        <RoleCard />
      </div>

      <p className="mt-10 text-muted-foreground text-center">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-[var(--highlight)] font-bold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
