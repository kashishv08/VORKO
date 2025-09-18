"use client"

import { useState } from "react"
import { CREATE_PROJ } from "@/src/lib/gql/mutation"
import { gqlClient } from "@/src/lib/service/gql"
import {
  Dialog,
  Button,
  Flex,
  Text,
  TextField,
  Select,
} from "@radix-ui/themes"

export default function AddProject() {
  // State for form fields
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [budget, setBudget] = useState<number | "">("")
  const [deadline, setDeadline] = useState("")
  const [status, setStatus] = useState("OPEN")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleAddProject = async () => {
    // Simple validation
    if (!title || !description || !budget || !deadline) {
      setError("Please fill all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const variables = {
        title,
        description,
        budget: parseFloat(budget as any),
        deadline,
        status,
      }

      const res = await gqlClient.request(CREATE_PROJ, variables)
      console.log("Project created:", res)

      // Reset form
      setTitle("")
      setDescription("")
      setBudget("")
      setDeadline("")
      setStatus("OPEN")
    } catch (err) {
      console.error(err)
      setError("Failed to create project")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>+ Post New Project</Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth="500px">
        <Dialog.Title>Add New Project</Dialog.Title>
        <Dialog.Description size="2" mb="4">
          Fill in the details below to create a new project.
        </Dialog.Description>

        <Flex direction="column" gap="3">
          {/* Title */}
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Title
            </Text>
            <TextField.Root
              placeholder="Enter project title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          {/* Description */}
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Description
            </Text>
            <TextField.Root
              placeholder="Enter project description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          {/* Budget */}
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Budget ($)
            </Text>
            <TextField.Root
              type="number"
              placeholder="Enter budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value === "" ? "" : Number(e.target.value))}
            />
          </label>

          {/* Deadline */}
          <label>
            <Text as="div" size="2" mb="1" weight="bold">
              Deadline
            </Text>
            <TextField.Root
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </label>

          {/* Status */}
          <label>
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
          </label>

          {error && <Text color="red">{error}</Text>}
        </Flex>

        {/* Actions */}
        <Flex gap="3" mt="4" justify="end">
          <Dialog.Close>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </Dialog.Close>
          <Button onClick={handleAddProject} disabled={loading}>
            {loading ? "Saving..." : "Save Project"}
          </Button>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  )
}
