"use client";
import { SignIn, useUser, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Signin() {
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn && user && !user.publicMetadata?.onboardingComplete) {
      router.replace("/onboarding");
      return;
    }
    if (isSignedIn && user && user.publicMetadata?.onboardingComplete) {
      router.replace("/");
      return;
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isLoaded) return <div>Loading...</div>;

  if (isSignedIn && user) {
    return <div>Redirecting...</div>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #eaf7fc 70%, #e6ecfb 100%)",
      }}
    >
      <SignIn />
    </div>
  );
}
