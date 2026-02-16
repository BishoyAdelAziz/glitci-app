import {
  formatDate,
  getPriorityColor,
  getStatusColor,
} from "@/utils/functions";
import { Project } from "@/types/projects";
import ActionsMenu, {
  EditIcon,
  TrashIcon,
  EyeIcon,
} from "@/components/ui/ActionsMenu";
import EditProjectModal from "./EditProjectModal";
import DeleteProjectModal from "./DeleteProjectModal";
interface ProjectRowProps {
  project: Project;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  setIsEditModalOpen: (isOpen: boolean) => void;
  setEditProjectId: (id: string | null) => void;
  isEditModalOpen: boolean;
  onDeleteClose: () => void;
  handleDelete: () => void;
}

export default function ProjectRow({
  project,
  isSelected,
  onSelect,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  setIsEditModalOpen,
  setEditProjectId,
  handleDelete,
}: ProjectRowProps) {
  const handleEdit = () => {
    setEditProjectId(project.id);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <tr className="grid grid-cols-15 gap-4 scroll-hidden px-6 py-4 text-sm text-gray-700 dark:text-gray-300 transition-colors even:bg-gray-50 even:dark:bg-gray-800 odd:bg-white odd:dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-gray-700">
        <td className="flex items-center col-span-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(project?.id)}
            className="w-4 h-4 accent-[#B72D2D] rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
        </td>
        <td className="font-medium col-span-2 inline-flex items-center justify-start truncate">
          {project?.name}
        </td>
        <td className="text-gray-600 col-span-2 dark:text-gray-400 flex items-center">
          {formatDate(project?.startDate)}
        </td>
        <td className="text-gray-600 col-span-2 dark:text-gray-400 flex items-center">
          {formatDate(project?.endDate)}
        </td>
        <td className="truncate flex items-center col-span-2">
          {project?.client}
        </td>
        <td className="inline-flex items-center justify-center col-span-2">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(
              project?.status,
            )}`}
          >
            {project?.status?.replace("_", " ")}
          </span>
        </td>
        <td className="flex items-center justify-center col-span-1">
          <div className="flex items-center justify-center">
            {project?.employeeCount}
          </div>
        </td>
        <td className="inline-flex items-center justify-center col-span-2">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getPriorityColor(
              project?.priority,
            )}`}
          >
            {project?.priority}
          </span>
        </td>
        <td className="flex items-center justify-center col-span-1">
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
                onClick: handleEdit,
              },
              {
                label: "Delete",
                icon: <TrashIcon />,
                onClick: handleDelete,
                variant: "danger",
              },
            ]}
          />
        </td>
      </tr>
    </>
  );
}
