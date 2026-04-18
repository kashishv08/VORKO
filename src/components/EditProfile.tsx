"use client";

import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import type { UserResource as ClerkUser } from "@clerk/types";
import { gqlClient } from "../lib/service/gql";
import { EDIT_PROFILE } from "../lib/gql/queries";

interface EditProfileProps {
  setCurrentUser: React.Dispatch<React.SetStateAction<ClerkUser | null>>;
}

interface FormState {
  name: string;
  bio: string;
}

export const EditProfile: React.FC<EditProfileProps> = ({ setCurrentUser }) => {
  const { user } = useUser();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: user?.fullName ?? "",
    bio:
      typeof user?.publicMetadata?.bio === "string"
        ? user.publicMetadata.bio
        : "",
  });
  const [skills, setSkills] = useState<string[]>(() =>
    Array.isArray(user?.publicMetadata?.skills)
      ? (user!.publicMetadata!.skills as string[])
      : []
  );
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<{
    name?: string;
    bio?: string;
    skills?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.fullName || "",
        bio:
          typeof user.publicMetadata?.bio === "string"
            ? user.publicMetadata.bio
            : "",
      });
      setSkills(
        Array.isArray(user.publicMetadata?.skills)
          ? user.publicMetadata.skills
          : []
      );
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && skillInput.trim()) {
      e.preventDefault();
      if (!skills.includes(skillInput.trim())) {
        setSkills([...skills, skillInput.trim()]);
        setSkillInput("");
        setErrors({ ...errors, skills: undefined });
      }
    }
  };

  const removeSkill = (skill: string) =>
    setSkills(skills.filter((s) => s !== skill));

  const validate = () => {
    const newErrors: { name?: string; bio?: string; skills?: string } = {};
    if (!form.name.trim()) newErrors.name = "Name cannot be empty";
    if (!form.bio.trim()) newErrors.bio = "Bio cannot be empty";
    if (skills.length === 0) newErrors.skills = "Add at least one skill";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!validate()) return;

    setLoading(true);

    try {
      const userRes = await fetch("/api/currentUser");
      const getUser = await userRes.json();

      await gqlClient.request(EDIT_PROFILE, {
        id: getUser.id,
        name: form.name,
        bio: form.bio,
        skills,
      });

      setCurrentUser((prev) => ({
        ...(prev ?? user),
        fullName: form.name,
        publicMetadata: {
          ...(prev ?? user).publicMetadata,
          bio: form.bio,
          skills,
        },
      }));

      setForm({ name: "", bio: "" });
      setSkills([]);
      setSkillInput("");
      setOpen(false);
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="cursor-pointer button-gradient text-white rounded-xl px-5 py-2 font-semibold shadow hover:shadow-lg transition">
          Edit Profile
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md rounded-2xl bg-glass p-6 border border-[var(--border)] shadow-xl focus:outline-none">
          <Dialog.Title className="text-xl font-semibold text-foreground mb-2 text-center">
            Edit Profile
          </Dialog.Title>
          <Dialog.Description className="text-sm text-muted mb-4 text-center">
            Update your profile information
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full bg-glass border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 transition ${
                  errors.name
                    ? "border-red-500 focus:ring-red-400"
                    : "border-[var(--border)] focus:ring-[var(--highlight)]"
                }`}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself"
                rows={3}
                className={`w-full bg-glass border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 transition ${
                  errors.bio
                    ? "border-red-500 focus:ring-red-400"
                    : "border-[var(--border)] focus:ring-[var(--highlight)]"
                }`}
              />
              {errors.bio && (
                <p className="text-sm text-red-500 mt-1">{errors.bio}</p>
              )}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Skills
              </label>
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                placeholder="Type a skill and press Enter"
                className={`w-full bg-glass border rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 transition ${
                  errors.skills
                    ? "border-red-500 focus:ring-red-400"
                    : "border-[var(--border)] focus:ring-[var(--highlight)]"
                }`}
              />
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-1 bg-[var(--primary)] text-white px-2 py-1 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="cursor-pointer hover:text-gray-200"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
              {errors.skills && (
                <p className="text-sm text-red-500 mt-1">{errors.skills}</p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="cursor-pointer px-4 py-2 rounded-md text-muted hover:text-foreground transition"
                  onClick={() => {
                    setForm({
                      name: user?.fullName || "",
                      bio:
                        typeof user?.publicMetadata?.bio === "string"
                          ? user.publicMetadata.bio
                          : "",
                    });
                    setSkills(
                      Array.isArray(user?.publicMetadata?.skills)
                        ? user.publicMetadata.skills
                        : []
                    );
                    setSkillInput("");
                    setErrors({});
                  }}
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={loading}
                className="cursor-pointer button-gradient px-6 py-2 text-white rounded-md font-semibold flex items-center justify-center gap-2"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
