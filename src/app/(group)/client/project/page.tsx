// src/app/(group)/client/project/page.tsx
import AddProject from "@/src/components/client/addProject";
import { CLIENT_PROJ } from "@/src/lib/gql/queries";
import { getUserFromCookie } from "@/src/lib/helper";
import { gqlClient } from "@/src/lib/service/gql";
import { Project } from "@prisma/client";
import { Tabs, Box, Text } from "@radix-ui/themes";
import Link from "next/link";

export default async function MyProjectsPage() {
  const user = await getUserFromCookie();
  if (!user) throw new Error("User not logged in");

  const proj: { clientAllPostedProjects: Project[] } = await gqlClient.request(
    CLIENT_PROJ,
    { id: user.id }
  );

  const allProj = proj.clientAllPostedProjects || [];

  const activeProjects = allProj.filter((p) => p.status === "OPEN" || p.status === "HIRED");

  const formatDate = (timestamp: number) => {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const renderProjectCard = (project: Project) => {
    const statusColor =
      project.status === "OPEN"
        ? "bg-green-100 text-green-700"
        : project.status === "HIRED"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-gray-100 text-gray-700";

    return (
      <div key={project.id} className="border rounded-lg p-4 flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold">{project.title}</h2>
          <p className="text-sm text-gray-600">{project.description}</p>
          <div className="flex gap-2 mt-3">
            <Link href={`/client/project/${project.id}`} className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">View</Link>
            <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">Edit</button>
            <button className="px-3 py-1 border rounded-md text-sm hover:bg-gray-100">Delete</button>
            <button className="px-3 py-1 bg-gray-100 rounded-md text-sm hover:bg-gray-200">View Proposals</button>
          </div>
        </div>
        <div className="text-right">
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${statusColor}`}>
            {project.status}
          </span>
          <p className="font-semibold mt-1">${project.budget}</p>
          <p className="text-sm text-gray-500">{formatDate(Number(project.deadline))}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="px-8 py-12 w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <AddProject />
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="activeProjects" className="w-full max-w-5xl mx-auto">
        <Tabs.List className="flex gap-4 border-b pb-2 mb-4">
          <Tabs.Trigger
            value="activeProjects"
            className="px-4 py-2 text-sm font-medium rounded-t-md data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-gray-500 hover:text-gray-700"
          >
            Active Projects
          </Tabs.Trigger>
          <Tabs.Trigger
            value="postedProjects"
            className="px-4 py-2 text-sm font-medium rounded-t-md data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 text-gray-500 hover:text-gray-700"
          >
            Posted Projects
          </Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          {/* Active Projects */}
          <Tabs.Content value="activeProjects">
            {activeProjects.length > 0 ? (
              <div className="space-y-4">{activeProjects.map(renderProjectCard)}</div>
            ) : (
              <Text size="2" className="text-gray-500">
                No active projects.
              </Text>
            )}
          </Tabs.Content>

          {/* Posted Projects */}
          <Tabs.Content value="postedProjects">
            {allProj.length > 0 ? (
              <div className="space-y-4">{allProj.map(renderProjectCard)}</div>
            ) : (
              <Text size="2" className="text-gray-500">
                No projects posted yet.
              </Text>
            )}
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </div>
  );
}
