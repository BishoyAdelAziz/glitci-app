"use client";
import ActionsMenu from "@/components/ui/ActionsMenu";
import ProjectRow from "../../projects/ProjectRow";
import { TrashIcon, EyeIcon, EditIcon } from "@/components/ui/ActionsMenu";
import { useState } from "react";
import React from "react";
import { formatDate } from "@/utils/functions";
import { getStatusColor } from "@/utils/functions";
import PriorityBadge from "@/components/ui/flags/PriorityFlag";
import { Project } from "@/types/projects";
interface Props {
  projects: Project[];
}
export default function ClientProjectsTable({ projects }: Props) {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const handleDelete = (projectId) => {
    setEditProjectId(projectId);
    setIsDeleteModalOpen(true);
  };
  const onDeleteClose = () => {
    setIsDeleteModalOpen(false);
  };
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(projects.map((p) => p.id));
    }
    setSelectAll(!selectAll);
  };
  const handleEdit = (projectId) => {
    setEditProjectId(projectId);
    setIsEditModalOpen(true);
  };
  const handleSelectProject = (id: string) => {
    if (selectedProjects.includes(id)) {
      setSelectedProjects(selectedProjects.filter((pId) => pId !== id));
    } else {
      setSelectedProjects([...selectedProjects, id]);
    }
  };
  return (
    <>
      <div>
        <h3 className="font-bold text-gray-500 text-xl">Client Projects</h3>
        <div className="bg-linear-to-r from-[#DE4646] h-1 w-[35%] mt-2 to-[#B72D2D]" />
      </div>
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm ring-[0.02rem] ring-gray-300 ">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto ring-1 ring-gray-700/20 dark:ring-white/15">
          <table className="w-full grid">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr className="grid grid-cols-14 gap-4 px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                <th className="flex items-center col-span-1">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded accent-[#B72D2D] border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                </th>
                <th className="col-span-2">Project Name</th>
                <th className="col-span-2">Start Date</th>
                <th className="col-span-2">End Date</th>
                <th className="col-span-2">Client</th>
                <th className="text-center col-span-1">Status</th>
                <th className="col-span-1 text-center">Team</th>
                <th className="text-center col-span-2">Priority</th>
                <th className="text-center col-span-1">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {projects.map((project: Project) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  isSelected={selectedProjects.includes(project.id)}
                  onSelect={handleSelectProject}
                  isDeleteModalOpen={isDeleteModalOpen}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                  setIsEditModalOpen={setIsEditModalOpen}
                  setEditProjectId={setEditProjectId}
                  isEditModalOpen={isEditModalOpen}
                  onDeleteClose={() => onDeleteClose}
                  handleDelete={() => handleDelete(project.id)}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 p-4 ring-1 ring-gray-700/20 dark:ring-white/15">
          {projects.map((project) => (
            <React.Fragment key={project.id}>
              <div
                key={project.id}
                className="bg-white dark:bg-gray-800 outline-1 outline-gray-700/30 dark:border-gray-700/30 rounded-xl p-4 space-y-3"
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {project.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {project.client}
                      </p>
                    </div>
                  </div>
                  <ActionsMenu
                    actions={[
                      {
                        label: "View",
                        icon: <EyeIcon />,
                        href: `/projects/${project.id}`,
                      },
                      {
                        label: "Edit",
                        icon: <EditIcon />,
                        onClick: () => handleEdit(project.id),
                      },
                      {
                        label: "Delete",
                        icon: <TrashIcon />,
                        onClick: () => handleDelete(project.id),
                        variant: "danger",
                      },
                    ]}
                  />
                </div>
                {/* Dates */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      Start:
                    </span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(project.startDate)}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">
                      End:
                    </span>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {formatDate(project.endDate)}
                    </p>
                  </div>
                </div>

                {/* Status & Priority */}
                <div className="flex gap-2 flex-wrap">
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(
                      project.status,
                    )}`}
                  >
                    {project.status.replace("_", " ")}
                  </span>
                  <div className="flex items-center max-w-7 justify-start">
                    <PriorityBadge priority={project?.priority} />
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mb-2 block">
                    Team Members ({project.employeeCount})
                  </span>
                </div>
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
}
