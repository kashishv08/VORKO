import RoleCard from "@/src/components/landing/RoleCard";
import { Briefcase, User } from "lucide-react";

export default function JoinVorko() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground transition-colors">
      <p className="text-lg mb-10 text-muted-foreground">
        Choose how you want to use the platform
      </p>
      <div className="flex gap-10 flex-col md:flex-row">
        <RoleCard />
      </div>
      <p className="mt-10 text-muted-foreground text-center">
        Already have an account?{" "}
        <a href="/login" className="text-green-500 font-bold underline">
          Log in
        </a>
      </p>
    </div>
  );
}
