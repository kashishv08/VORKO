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
  const { user, isLoaded } = useUser();
  const queryRole = params.get("role");
  const role = user?.publicMetadata?.role || queryRole;

  const router = useRouter();
  console.log("onboard", role);

  const [bio, setBio] = useState("");
  const [skill, setSkill] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ bio?: string; skills?: string }>({});

  useEffect(() => {
    if (!isLoaded || !user) return;

    const setRoleAndRedirect = async () => {
      try {
        const res = await fetch("/api/set-role", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ clerkId: user.id, role }),
        });
        const data = await res.json();
        if (!data.success) {
          toast.error("Unable to set role. Please try again.");
          return;
        }
      } catch (err) {
        console.error("Error setting role:", err);
        toast.error("Something went wrong. Please try again.");
      }
    };

    setRoleAndRedirect();
  }, [isLoaded, user, role]);

  const removeSkill = (remove: string) => {
    setSkills((skills) => skills.filter((s) => s !== remove));
  };

  const addSkill = () => {
    if (!skill.trim() || skills.includes(skill.trim())) return;
    setSkills((prev) => [...prev, skill.trim()]);
    setSkill("");
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  const handleOnboard = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!bio.trim()) newErrors.bio = "Bio cannot be empty";
    else if (/^\d+$/.test(bio.trim()))
      newErrors.bio = "Bio cannot contain only numbers";

    if (role === "FREELANCER" && skills.length === 0)
      newErrors.skills = "Please add at least one skill";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!user) {
      toast.error("User not found. Please sign in again.");
      return;
    }
    if (!role) {
      toast.error("Missing role. Please restart signup.");
      return;
    }

    try {
      const userOnboard: { completeOnboarding: User } = await gqlClient.request(
        COMPLETE_ONBOARD,
        { bio, skills, role }
      );

      if (userOnboard?.completeOnboarding) {
        toast.success("Onboarding completed! Redirecting...");
        setBio("");
        setSkills([]);
        setTimeout(() => {
          router.push(`/${role?.toLowerCase()}/dashboard`);
        }, 1000);
      } else {
        toast.error("Onboarding failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-24 bg-background">
      <div className="w-[600px] max-w-full">
        <h1 className="text-4xl font-bold mb-2">Complete Your Profile</h1>
        <p className="text-base text-muted-foreground mb-2">
          Help others know more about you
        </p>
        <form
          onSubmit={handleOnboard}
          className="rounded-xl shadow-2xl px-8 py-8 bg-card"
        >
          <label className="font-semibold block mb-2">
            {role === "CLIENT" ? "Bio" : "Bio (Visible to clients)"}
          </label>
          <textarea
            className="w-full rounded-lg bg-background border border-border p-4 mb-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            rows={4}
            placeholder={
              role === "CLIENT"
                ? "Tell freelancers about your company..."
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
                  placeholder="Add a skill (e.g., React)"
                  value={skill}
                  onChange={(e) => setSkill(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <button
                  type="button"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
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
                    className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                  >
                    {sk}
                    <button
                      type="button"
                      onClick={() => removeSkill(sk)}
                      className="ml-1 text-lg hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </>
          )}

          <button
            type="submit"
            className="cursor-pointer bg-green-500 text-white rounded-lg px-8 py-3 mt-4 hover:bg-green-600"
          >
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
}
