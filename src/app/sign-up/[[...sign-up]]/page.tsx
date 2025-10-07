"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { SignUp, useUser } from "@clerk/nextjs";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SignUpPage() {
  const params = useSearchParams();
  const role = params.get("role");
  const { user } = useUser();
  const router = useRouter();

  console.log("signup", role);

  useEffect(() => {
    if (!role) return;

    const checkRole = async () => {
      const email = user?.primaryEmailAddress?.emailAddress;
      if (!email) return;

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
    };

    checkRole();
  }, [role]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <div className="mt-10">
        <SignUp
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl={`/onboarding?role=${role}`}
          unsafeMetadata={{ role }} // optional now
          appearance={{
            elements: {
              card: "pt-2",
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
