import {
  formatDate,
  getAvatarColor,
  getInitials,
  getPriorityColor,
  getStatusColor,
} from "@/utils/functions";
import { Project } from "./ProjectsTable";
interface ProjectRowProps {
  project: Project;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function ProjectRow({
  project,
  isSelected,
  onSelect,
}: ProjectRowProps) {
  // Generate mock employee avatars based on employeeCount

  return (
    <tr className="grid grid-cols-15 gap-4 px-6 py-4 text-sm text-gray-700 dark:text-gray-300 transition-colors even:bg-gray-50 even:dark:bg-gray-800 odd:bg-white odd:dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-gray-700">
      <td className="flex items-center col-span-1">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(project?.id)}
          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
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
        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
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
      </td>
    </tr>
  );
}
