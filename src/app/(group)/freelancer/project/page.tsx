// src/app/(group)/client/project/page.tsx
import { ALL_CLIENTS_PROJECTS } from "@/src/lib/gql/queries";
import { gqlClient } from "@/src/lib/service/gql";
import { auth } from "@clerk/nextjs/server";
import { Project } from "@prisma/client";
import { Text } from "@radix-ui/themes";
import Link from "next/link";

export default async function MyProjectsPage() {
  const { userId } = await auth();
  // console.log(userId);
  if (!userId) throw new Error("User not logged in");

  const proj: { allClientsProject: Project[] } = await gqlClient.request(
    ALL_CLIENTS_PROJECTS
  );

  // console.log(proj);

  const openProjects = (proj.allClientsProject || []).filter(
    (p) => p.status === "OPEN"
  );

  const formatDate = (timestamp: number) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const renderProjectCard = (project: Project) => {
    return (
      <div
        key={project.id}
        className="border rounded-lg p-4 flex justify-between items-start"
      >
        <div>
          <h2 className="text-lg font-semibold">{project.title}</h2>
          <p className="text-sm text-gray-600">{project.description}</p>
          <div className="flex gap-2 mt-3">
            <Link
              href={`/freelancer/project/${project.id}`}
              className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100"
            >
              View
            </Link>
          </div>
        </div>
        <div className="text-right">
          <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700">
            {project.status}
          </span>
          <p className="font-semibold mt-1">${project.budget}</p>
          <p className="text-sm text-gray-500">
            {formatDate(Number(project.deadline))}
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="px-8 py-12 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Active Projects</h1>
      </div>

      {/* Project List */}
      {openProjects.length > 0 ? (
        <div className="space-y-4">{openProjects.map(renderProjectCard)}</div>
      ) : (
        <Text size="2" className="text-gray-500">
          No active projects.
        </Text>
      )}
    </div>
  );
}
