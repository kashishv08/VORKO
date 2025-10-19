"use client";

import { useState, useRef } from "react";
import { CREATE_PROJ } from "@/src/lib/gql/mutation";
import { gqlClient } from "@/src/lib/service/gql";
import { Dialog, Button, Flex, Text, TextField } from "@radix-ui/themes";
import { Project } from "@prisma/client";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function AddProject({
  setAllProj,
  setActiveProject,
}: {
  setAllProj: React.Dispatch<React.SetStateAction<Project[]>>;
  setActiveProject: React.Dispatch<React.SetStateAction<Project[]>>;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState<number | "">("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("OPEN");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const closeDialogRef = useRef<HTMLButtonElement>(null);

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

  const handleAddProject = async () => {
    if (!validate()) return;
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
      closeDialogRef.current?.click();

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
    <Dialog.Root>
      {/* Trigger Button */}
      <Dialog.Trigger asChild>
        <motion.button
          whileHover={{
            scale: 1.05,
            boxShadow: "0 10px 25px rgba(31,125,83,0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2 rounded-lg bg-[var(--primary)] text-[var(--background)] font-medium cursor-pointer shadow-md transition"
        >
          + Post New Project
        </motion.button>
      </Dialog.Trigger>

      {/* Dialog Content */}
      <Dialog.Content
        maxWidth="500px"
        className="bg-[var(--surface)] dark:bg-[var(--surface)] rounded-xl p-6 shadow-xl"
      >
        <Dialog.Title className="text-xl font-bold text-[var(--foreground)] mb-2">
          Add New Project
        </Dialog.Title>
        <Dialog.Description className="text-[var(--muted)] mb-5">
          Fill in the details below to create a new project.
        </Dialog.Description>

        <Flex direction="column" gap="4">
          {/* Title */}
          <label>
            <Text
              as="div"
              size="2"
              weight="bold"
              className="text-[var(--foreground)] mb-1"
            >
              Title
            </Text>
            <TextField.Root
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={!!errors.title}
              className="bg-[var(--glass)] border border-[var(--accent)] text-[var(--foreground)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-text transition"
            />
            {errors.title && (
              <Text color="red" size="2">
                {errors.title}
              </Text>
            )}
          </label>

          {/* Description */}
          <label>
            <Text
              as="div"
              size="2"
              weight="bold"
              className="text-[var(--foreground)] mb-1"
            >
              Description
            </Text>
            <TextField.Root
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={!!errors.description}
              className="bg-[var(--glass)] border border-[var(--accent)] text-[var(--foreground)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-text transition"
            />
            {errors.description && (
              <Text color="red" size="2">
                {errors.description}
              </Text>
            )}
          </label>

          {/* Budget */}
          <label>
            <Text
              as="div"
              size="2"
              weight="bold"
              className="text-[var(--foreground)] mb-1"
            >
              Budget ($)
            </Text>
            <TextField.Root
              type="number"
              placeholder="Enter budget"
              value={budget}
              onChange={(e) =>
                setBudget(e.target.value === "" ? "" : Number(e.target.value))
              }
              aria-invalid={!!errors.budget}
              className="bg-[var(--glass)] border border-[var(--accent)] text-[var(--foreground)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-text transition"
            />
            {errors.budget && (
              <Text color="red" size="2">
                {errors.budget}
              </Text>
            )}
          </label>

          {/* Deadline */}
          <label>
            <Text
              as="div"
              size="2"
              weight="bold"
              className="text-[var(--foreground)] mb-1"
            >
              Deadline
            </Text>
            <TextField.Root
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              aria-invalid={!!errors.deadline}
              className="bg-[var(--glass)] border border-[var(--accent)] text-[var(--foreground)] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-text transition"
            />
            {errors.deadline && (
              <Text color="red" size="2">
                {errors.deadline}
              </Text>
            )}
          </label>

          {errors.submit && <Text color="red">{errors.submit}</Text>}
        </Flex>

        {/* Actions */}
        <Flex gap="3" mt="6" justify="end">
          <Dialog.Close asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-lg bg-[var(--accent)] text-[var(--background)] cursor-pointer shadow-sm transition"
            >
              Cancel
            </motion.button>
          </Dialog.Close>

          <Dialog.Close>
            <button ref={closeDialogRef} style={{ display: "none" }} />
          </Dialog.Close>

          <motion.button
            onClick={handleAddProject}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 8px 20px rgba(31,125,83,0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-[var(--primary)] text-[var(--background)] font-medium cursor-pointer shadow-md transition"
          >
            {loading ? "Saving..." : "Save Project"}
          </motion.button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
