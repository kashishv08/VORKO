"use client";

import { CREATE_PROJ } from "@/src/lib/gql/mutation";
import { gqlClient } from "@/src/lib/service/gql";
import { Project } from "@prisma/client";
import { motion } from "framer-motion";
import { CirclePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";

export default function AddProject({
  setAllProj,
  setActiveProject,
}: {
  setAllProj: React.Dispatch<React.SetStateAction<Project[]>>;
  setActiveProject: React.Dispatch<React.SetStateAction<Project[]>>;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Validate all fields
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (budget === "" || budget <= 0)
      newErrors.budget = "Budget must be positive";
    if (!deadline) newErrors.deadline = "Deadline is required";
    else if (new Date(deadline) < new Date())
      newErrors.deadline = "Deadline must be in the future";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    if (!validate()) return; // Stop if validation fails
    setLoading(true);

    try {
      const variables = {
        title,
        description,
        budget: Number(budget),
        deadline,
        status,
      };
      const res: { createProject: Project } = await gqlClient.request(
        CREATE_PROJ,
        variables
      );
      const project = res.createProject;

      if (project.status === "OPEN")
        setActiveProject((prev) => [...prev, project]);
      setAllProj((prev) => [...prev, project]);

      toast.success("Project added successfully!");
      setOpen(false); // ✅ close modal automatically

      // Reset form
      setTitle("");
      setDescription("");
      setBudget("");
      setDeadline("");
      setStatus("OPEN");
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to create project" });
      toast.error("Failed to add project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <Dialog.Trigger asChild>
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(31,125,83,0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-[var(--primary)] text-white font-medium shadow-md transition cursor-pointer"
        >
          <CirclePlus size={17} />
          <span>New Project</span>
        </motion.button>
      </Dialog.Trigger>

      {/* Dialog Content */}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md rounded-2xl bg-glass p-6 border border-[var(--border)] shadow-xl focus:outline-none">
          <Dialog.Title className="text-xl font-semibold text-foreground mb-2 text-center">
            Add New Project
          </Dialog.Title>
          <Dialog.Description className="text-sm text-muted mb-4 text-center">
            Fill in the details below to create a new project.
          </Dialog.Description>

          <form onSubmit={handleAddProject} className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter project title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-glass border border-[var(--border)] rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--highlight)] transition"
              />
              {errors.title && (
                <p className="text-amber-400 text-xs mt-1">{errors.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Description
              </label>
              <textarea
                placeholder="Enter project description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-glass border border-[var(--border)] rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--highlight)] transition"
              />
              {errors.description && (
                <p className="text-amber-400 text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Budget */}
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Budget ($)
              </label>
              <input
                type="number"
                placeholder="Enter budget"
                value={budget}
                onChange={(e) =>
                  setBudget(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full bg-glass border border-[var(--border)] rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--highlight)] transition"
              />
              {errors.budget && (
                <p className="text-amber-400 text-xs mt-1">{errors.budget}</p>
              )}
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-muted mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full bg-glass border border-[var(--border)] rounded-md px-3 py-2 text-foreground focus:outline-none focus:ring-2 focus:ring-[var(--highlight)] transition"
              />
              {errors.deadline && (
                <p className="text-amber-400 text-xs mt-1">{errors.deadline}</p>
              )}
            </div>

            {errors.submit && (
              <p className="text-amber-400 text-xs mt-1">{errors.submit}</p>
            )}

            {/* Buttons */}
            <div className="flex justify-end gap-3 mt-4">
              <Dialog.Close asChild>
                <button className="px-4 py-2 rounded-md text-muted hover:text-foreground transition cursor-pointer">
                  Cancel
                </button>
              </Dialog.Close>

              <motion.button
                type="submit"
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 8px 20px rgba(31,125,83,0.3)",
                }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                className="px-6 py-2 rounded-md bg-[var(--primary)] text-white font-semibold shadow-md transition cursor-pointer"
              >
                {loading ? "Saving..." : "Save Project"}
              </motion.button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
