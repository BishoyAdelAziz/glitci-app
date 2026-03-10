"use client";

import React, { Dispatch, SetStateAction, useState } from "react";
import useProjects from "@/hooks/useProjects";
import ProjectRow from "./ProjectRow";
import {
  formatDate,
  getPriorityColor,
  getStatusColor,
} from "@/utils/functions";
import AddProjectModal from "./AddProjectModal";
import ActionsMenu, {
  EditIcon,
  TrashIcon,
  EyeIcon,
} from "@/components/ui/ActionsMenu";
import EditProjectModal from "./EditProjectModal";
import Pagination from "@/components/ui/Pagination";
import StackedPagination from "@/components/ui/Pagination";
import DeleteProjectModal from "./DeleteProjectModal";
// Types matching API response
import { Project } from "@/types/projects";
import { useSearchParam } from "@/hooks/useSearchParam";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ProjectsTable({ isOpen, setIsOpen }: Props) {
  const search = useSearchParam();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  // onClose lives here in the parent component
  const onClose = () => {
    setIsOpen(false);
  };
  const onDeleteClose = () => {
    setIsDeleteModalOpen(false);
  };
  const { projects, isLoading, isError, pagination } = useProjects({
    page,
    name: search,
  });

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

  const handleEdit = (projectId) => {
    setEditProjectId(projectId);
    setIsEditModalOpen(true);
  };
  const handleDelete = (projectId) => {
    setEditProjectId(projectId);
    setIsDeleteModalOpen(true);
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
    <>
      <div>
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
                      <input
                        type="checkbox"
                        checked={selectedProjects.includes(project.id)}
                        onChange={() => handleSelectProject(project.id)}
                        className="mt-1 w-4 h-4 accent-[#B72D2D] rounded border-gray-300 dark:border-gray-600 text-blue-600"
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
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
        {/* Pass onClose to the modal */}
        <AddProjectModal isOpen={isOpen} onClose={onClose} />
        <div className="translate-y-8 relative transform">
          {pagination && (
            <StackedPagination
              total={pagination?.totalPages}
              limit={pagination?.limit}
              currentPage={pagination?.currentPage}
              onChange={(page) => setPage(page)}
            />
          )}
        </div>
      </div>
      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteClose}
        projectId={editProjectId}
        projectName={
          selectedProjects.length === 1
            ? projects.find((p) => p.id === selectedProjects[0])?.name
            : undefined
        }
      />
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={editProjectId}
      />
    </>
  );
}
