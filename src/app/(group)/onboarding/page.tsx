"use client";
import { COMPLETE_ONBOARD } from "@/src/lib/gql/mutation";
import { gqlClient } from "@/src/lib/service/gql";
import { useUser } from "@clerk/nextjs";
import { User } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState, KeyboardEvent, useEffect } from "react";
import { toast } from "sonner";

export default function Onboarding() {
  const params = useSearchParams();
  const role = params.get("role") === "FREELANCER" ? "FREELANCER" : "CLIENT";
  const [bio, setBio] = useState("");
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ bio?: string; skills?: string }>({});
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    // run only after clerk user object is loaded
    if (!isLoaded || !user) return;

    const checkAndRedirect = async () => {
      try {
        const email =
          user.primaryEmailAddress?.emailAddress ||
          user.emailAddresses?.[0]?.emailAddress;
        if (!email) return; // weird case, but guard

        const res = await fetch("/api/check-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();

        if (data.exists) {
          // show a warning toast and redirect to user's dashboard
          toast.warning(
            "Account already exists. Redirecting you to your dashboard..."
          );
          // route to the existing role's dashboard (client or freelancer)
          setTimeout(() => {
            const role = (data.role || "CLIENT").toLowerCase();
            router.push(`/${role}/dashboard`);
          }, 1200);
        }
        // else: brand new user — continue onboarding form as normal
      } catch (err) {
        console.error("onboard check err", err);
        // don't block onboarding on check errors; optionally notify
      }
    };

    checkAndRedirect();
  }, [isLoaded, user, router]);

  const removeSkill = (remove: string) => {
    setSkills((skills) => skills.filter((s) => s !== remove));
  };

  const addSkill = () => {
    if (!skill.trim()) return;
    if (skills.includes(skill.trim())) return;
    setSkills((prev) => [...prev, skill.trim()]);
    setSkill("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // prevent form submit
      addSkill();
    }
  };

  const handleOnboard = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    // Validate bio
    if (!bio.trim()) {
      newErrors.bio = "Bio cannot be empty";
    } else if (/^\d+$/.test(bio.trim())) {
      newErrors.bio = "Bio cannot contain only numbers";
    }

    // Validate freelancer skills
    if (role === "FREELANCER" && skills.length === 0) {
      newErrors.skills = "Please add at least one skill";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const userOnboard: { completeOnboarding: User } = await gqlClient.request(
        COMPLETE_ONBOARD,
        { bio, skills }
      );

      if (userOnboard?.completeOnboarding) {
        window.location.href = `/${role.toLowerCase()}/dashboard`;
        setBio("");
        setSkills([]);
        alert("Onboarding completed!");
      } else {
        alert("Onboarding failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen text-foreground flex flex-col items-center pt-24 bg-background">
      <div className="w-[600px] max-w-full">
        <h1 className="text-4xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-base text-muted-foreground mb-2">
          Help others know more about you
        </p>
        <div className="w-full h-2 rounded bg-muted mb-7 overflow-hidden">
          <div
            className="bg-green-500 h-full rounded"
            style={{ width: "70%" }}
          />
        </div>
        <div className="rounded-xl shadow-2xl px-8 py-8 bg-card">
          <h2 className="text-2xl font-bold mb-2">About You</h2>
          <p className="mb-6 text-muted-foreground">
            {role === "CLIENT"
              ? "Tell us about yourself and your business"
              : "Tell us about yourself and your expertise"}
          </p>
          <form onSubmit={handleOnboard}>
            <label className="font-semibold block mb-2">
              {role === "CLIENT" ? "Bio" : "Bio (Visible to clients)"}
            </label>
            <textarea
              className="w-full rounded-lg bg-background border border-border p-4 text-base mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition"
              rows={4}
              placeholder={
                role === "CLIENT"
                  ? "Tell freelancers about your company and the types of projects you work on..."
                  : "Describe your skills, experience, and what makes you unique..."
              }
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm mb-4">{errors.bio}</p>
            )}

            {role === "FREELANCER" && (
              <>
                <label className="font-semibold block mb-2">Skills</label>
                <div className="flex gap-2 mb-2">
                  <input
                    className="flex-1 rounded-lg bg-background border border-green-500 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    placeholder="Add a skill (e.g., React, Design, Writing)"
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    onKeyDown={handleKeyDown} // add on enter
                  />
                  <button
                    type="button"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-600"
                    onClick={addSkill}
                  >
                    Add
                  </button>
                </div>
                {errors.skills && (
                  <p className="text-red-500 text-sm mb-2">{errors.skills}</p>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                  {skills.map((sk) => (
                    <span
                      key={sk}
                      className="flex items-center gap-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm"
                    >
                      {sk}
                      <button
                        type="button"
                        onClick={() => removeSkill(sk)}
                        className="ml-1 text-lg text-green-800 dark:text-green-200 focus:outline-none hover:text-red-500"
                        aria-label="Remove skill"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </>
            )}

            <div className="flex gap-4 mt-6">
              <button
                type="submit"
                className="cursor-pointer bg-green-500 text-white rounded-lg px-8 py-3 font-semibold hover:bg-green-600"
              >
                Complete Setup
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
