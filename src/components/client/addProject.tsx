"use client";

import { useState, useRef } from "react";
import { CREATE_PROJ } from "@/src/lib/gql/mutation";
import { gqlClient } from "@/src/lib/service/gql";
import {
  Dialog,
  Button,
  Flex,
  Text,
  TextField,
  Select,
} from "@radix-ui/themes";
import { Project } from "@prisma/client";

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
      newErrors.budget = "Budget must be a positive number";
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

      // ✅ Close dialog programmatically
      closeDialogRef.current?.click();

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button style={{ backgroundColor: "green", cursor: "pointer" }}>
          + Post New Project
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="500px">
        <Dialog.Title>Add New Project</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Fill in the details below to create a new project.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Title
            </Text>
            <TextField.Root
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              aria-invalid={!!errors.title}
            />
            {errors.title && (
              <Text color="red" size="2">
                {errors.title}
              </Text>
            )}
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Description
            </Text>
            <TextField.Root
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-invalid={!!errors.description}
            />
            {errors.description && (
              <Text color="red" size="2">
                {errors.description}
              </Text>
            )}
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
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
            />
            {errors.budget && (
              <Text color="red" size="2">
                {errors.budget}
              </Text>
            )}
          </label>

          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Deadline
            </Text>
            <TextField.Root
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              aria-invalid={!!errors.deadline}
            />
            {errors.deadline && (
              <Text color="red" size="2">
                {errors.deadline}
              </Text>
            )}
          </label>

          {/* <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Status
            </Text>
            <Select.Root value={status} onValueChange={setStatus}>
              <Select.Trigger>{status}</Select.Trigger>
              <Select.Content>
                <Select.Item value="OPEN">OPEN</Select.Item>
                <Select.Item value="HIRED">HIRED</Select.Item>
                <Select.Item value="CLOSED">CLOSED</Select.Item>
              </Select.Content>
            </Select.Root>
          </label> */}

          {errors.submit && <Text color="red">{errors.submit}</Text>}
        </Flex>

        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray" className="cursor-pointer">
              Cancel
            </Button>
          </Dialog.Close>

          <Dialog.Close>
            <button ref={closeDialogRef} style={{ display: "none" }} />
          </Dialog.Close>

          <Button
            onClick={handleAddProject}
            disabled={loading}
            style={{ backgroundColor: "green", cursor: "pointer" }}
          >
            {loading ? "Saving..." : "Save Project"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
}
