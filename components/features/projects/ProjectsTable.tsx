"use client";

import { useState } from "react";
import Image from "next/image";
import { useProjects } from "@/hooks/useProjects";
import ProjectRow from "./ProjectRow";
import {
  formatDate,
  getAvatarColor,
  getInitials,
  getPriorityColor,
  getStatusColor,
} from "@/utils/functions";
// Types matching API response
export interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: "planning" | "active" | "on_hold" | "completed" | "cancelled";
  priority: "low" | "medium" | "high";
  employeeCount: number;
}

// ==================== ProjectsTable Component ====================
export default function ProjectsTable() {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const { projects, isLoading, isError } = useProjects();

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectProject = (id: string) => {
    if (selectedProjects.includes(id)) {
      setSelectedProjects(selectedProjects.filter((pId) => pId !== id));
    } else {
      setSelectedProjects([...selectedProjects, id]);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="text-center text-red-600 dark:text-red-400">
          Error loading projects. Please try again.
        </div>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          No projects found.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm">
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full grid">
          <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <tr className="grid grid-cols-15 gap-4 px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
              <th className="flex items-center col-span-1">
                <input
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
              </th>
              <th className="col-span-2">Project Name</th>
              <th className="col-span-2">Start Date</th>
              <th className="col-span-2">End Date</th>
              <th className="col-span-2">Client</th>
              <th className="text-center col-span-2">Status</th>
              <th className="col-span-1 text-center">Team</th>
              <th className="text-center col-span-2">Priority</th>
              <th className="text-center col-span-1">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {projects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                isSelected={selectedProjects.includes(project.id)}
                onSelect={handleSelectProject}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 p-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 space-y-3"
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3 flex-1">
                <input
                  type="checkbox"
                  checked={selectedProjects.includes(project.id)}
                  onChange={() => handleSelectProject(project.id)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    {project.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {project.client}
                  </p>
                </div>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                  />
                </svg>
              </button>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500 dark:text-gray-400">Start:</span>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(project.startDate)}
                </p>
              </div>
              <div>
                <span className="text-gray-500 dark:text-gray-400">End:</span>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(project.endDate)}
                </p>
              </div>
            </div>

            {/* Status & Priority */}
            <div className="flex gap-2 flex-wrap">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(
                  project.status,
                )}`}
              >
                {project.status.replace("_", " ")}
              </span>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityColor(
                  project.priority,
                )}`}
              >
                {project.priority}
              </span>
            </div>

            {/* Team Members */}
            <div>
              <span className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                Team Members ({project.employeeCount})
              </span>
              <div className="flex items-center -space-x-2">
                {Array.from({ length: Math.min(project.employeeCount, 4) }).map(
                  (_, i) => (
                    <div
                      key={i}
                      className="relative w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden"
                    >
                      <div
                        className={`w-full h-full flex items-center justify-center text-white text-xs font-semibold ${getAvatarColor(
                          `Employee ${i + 1}`,
                        )}`}
                      >
                        {getInitials(`Employee ${i + 1}`)}
                      </div>
                    </div>
                  ),
                )}
                {project.employeeCount > 4 && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400">
                    +{project.employeeCount - 4}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
