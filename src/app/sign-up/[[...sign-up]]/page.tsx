"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { SignUp } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SignUpPage() {
  const params = useSearchParams();
  const router = useRouter();
  const role = params.get("role") || "CLIENT";
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    if (isSignedIn && !!user) {
      router.push(`/onboarding?role=${role}`);
    }
  }, [isSignedIn, user, role, router]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="mt-10">
          <SignUp
            path="/sign-up"
            signInUrl="/sign-in"
            afterSignUpUrl={`/onboarding?role=${role}`}
            unsafeMetadata={{ role }}
            appearance={{
              elements: {
                card: "pt-2",
                headerTitle: () => (
                  <div className="flex flex-col items-center mb-2">
                    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 shadow mb-1">
                      <svg
                        width="23"
                        height="23"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <circle cx="16" cy="16" r="16" fill="#22c55e" />
                        <text
                          x="50%"
                          y="57%"
                          textAnchor="middle"
                          fill="white"
                          fontSize="13"
                          fontWeight="bold"
                          fontFamily="Arial, sans-serif"
                          dy=".3em"
                        >
                          V
                        </text>
                      </svg>
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      Join VORKO
                    </p>
                  </div>
                ),
              },
            }}
          />
        </div>
        <p>
          Joining as <b>{role}</b>
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <p>Redirecting to onboarding…</p>
    </div>
  );
}
