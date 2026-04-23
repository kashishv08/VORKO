"use client";

import { SignUp, useUser } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { LancifyLogo } from "@/src/components/LancifyLogo";

export default function SignUpPage() {
  const params = useSearchParams();
  const role = params.get("role");
  const { user, isLoaded: userLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!role) return;

    const checkRole = async () => {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

      try {
        const res = await fetch("/api/check-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, role }),
        });
        const data = await res.json();
        if (data.roleConflict) {
          toast.error(
            `You already signed up as ${data.existingRole}. Please sign in.`
          );
          router.push("/sign-in");
        }
      } catch (err) {
        console.error("Error checking role:", err);
      }
    };

    if (userLoaded && user) {
      checkRole();
    }
  }, [role, user, userLoaded, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 flex flex-col items-center">
        {/* <div className="mb-4">
          <LancifyLogo />
        </div>
        {/* <h1 className="text-2xl font-semibold text-slate-900">Create an account</h1> */}
        {/* <p className="text-slate-500 mt-1">
          Join Lancify as a <span className="text-primary font-bold">{role?.toLowerCase() || "user"}</span>
        </p> */}
      </div>

      <div className="w-full max-w-md">
        <SignUp
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl={role ? `/onboarding?role=${role}` : "/role-selection"}
          unsafeMetadata={{ role }}
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border-none bg-transparent w-full",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm font-semibold transition-all shadow-md shadow-primary/20",
              footerActionLink: "text-primary hover:text-primary/90 font-semibold",
              identityPreviewText: "text-slate-600",
              identityPreviewEditButton: "text-primary hover:text-primary/90",
              formFieldInput: "rounded-xl border-slate-200 focus:border-primary focus:ring-primary/10 transition-all",
              formFieldLabel: "text-slate-700 font-medium mb-1.5",
              socialButtonsBlockButton: "rounded-xl border-slate-200 hover:bg-slate-50 transition-all",
              socialButtonsBlockButtonText: "text-slate-600 font-medium",
              dividerLine: "bg-slate-100",
              dividerText: "text-slate-400 text-xs uppercase tracking-wider font-semibold"
            }
          }}
        />
      </div>

      {/* <p className="mt-8 text-sm text-slate-500 text-center">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-primary font-bold hover:underline">
          Sign In
        </Link>
      </p> */}
    </div>
  );
}
