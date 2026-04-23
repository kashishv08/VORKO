"use client";

import { SignIn, useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LancifyLogo } from "@/src/components/LancifyLogo";

export default function Signin() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user) {
      const role = user.publicMetadata?.role;
      const onboardingComplete = user.publicMetadata?.onboardingComplete;

      if (!role) {
        router.replace("/role-selection");
      } else if (!onboardingComplete) {
        router.replace(`/onboarding?role=${role}`);
      } else {
        router.replace(`/${(role as string).toLowerCase()}/dashboard`);
      }
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded) return null;
  if (isSignedIn && user) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <div className="mb-8 flex flex-col items-center">
        {/* <div className="mb-4"> */}
        {/* <LancifyLogo /> */}
        {/* </div> */}
        {/* <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-slate-500 mt-1">Please enter your details to sign in</p> */}
      </div>

      <div className="w-full max-w-md justify-center items-center">
        <SignIn
          fallbackRedirectUrl="/role-selection"
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
        By signing in, you agree to our{" "}
        <a href="#" className="text-primary hover:underline">Terms of Service</a>
        {" "}and{" "}
        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
      </p> */}
    </div>
  );
}
