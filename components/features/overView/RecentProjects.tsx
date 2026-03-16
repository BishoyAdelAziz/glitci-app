"use client";
import { Project } from "@/types/analytics";
export default function RecentProjectsTable({
  projects,
}: {
  projects?: Project[];
}) {
  const statusColor = (status: Project["status"]) => {
    switch (status) {
      case "planning":
        return "bg-yellow-100 text-yellow-700";

      case "active":
        return "bg-blue-100 text-blue-700";

      case "completed":
        return "bg-green-100 text-green-700";

      case "on_hold":
        return "bg-gray-200 text-gray-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <div className="w-full bg-white col-span-1 md:col-span-2 dark:bg-gray-800 rounded-4xl p-4 overflow-x-auto">
      <div className="mb-4">
        <h3 className="text-lg font-semibold font-poppins">Recent Projects</h3>
      </div>

      <table className="w-full text-sm text-left overflow-y-scroll">
        <thead className="border-b border-gray-200 dark:border-gray-700">
          <tr className="text-gray-500">
            <th className="py-3 px-2">Project</th>
            <th className="py-3 px-2">Client</th>
            <th className="py-3 px-2">Department</th>
            <th className="py-3 px-2">Status</th>
            <th className="py-3 px-2">Start</th>
            <th className="py-3 px-2">End</th>
            <th className="py-3 px-2">Budget</th>
          </tr>
        </thead>

        <tbody>
          {projects?.map((project) => (
            <tr
              key={project.id}
              className="border-b border-gray-100 dark:border-gray-700"
            >
              <td className="py-3 px-2 font-medium">{project.name}</td>

              <td className="py-3 px-2">{project.client}</td>

              <td className="py-3 px-2 capitalize">
                {project.department || "—"}
              </td>

              <td className="py-3 px-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs capitalize ${statusColor(
                    project.status,
                  )}`}
                >
                  {project.status}
                </span>
              </td>

              <td className="py-3 px-2">{formatDate(project.startDate)}</td>

              <td className="py-3 px-2">{formatDate(project.endDate)}</td>

              <td className="py-3 px-2 font-medium">
                ${project.budget.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
