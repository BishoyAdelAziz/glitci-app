import { formatDate, getStatusFlagColor } from "@/utils/functions";
import ActionsMenu, {
  EditIcon,
  TrashIcon,
  EyeIcon,
} from "@/components/ui/ActionsMenu";
import { Service } from "@/types/services";
import { Dispatch, SetStateAction } from "react";
// import EditProjectModal from "./EditProjectModal";
// import DeleteProjectModal from "./DeleteProjectModal";
interface ProjectRowProps {
  service: Service;
  isSelected: boolean | undefined;
  onSelect: (id: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ServiceRow({
  service,
  isSelected,
  onSelect,
  onDelete,
  onEdit,
}: ProjectRowProps) {
  // const handleEdit = () => {
  //   setEditProjectId(service.id);
  //   setIsEditModalOpen(true);
  // };

  return (
    <>
      <tr className="grid grid-cols-15 gap-4 scroll-hidden px-6 py-4 text-sm text-gray-700 dark:text-gray-300 transition-colors even:bg-gray-50 even:dark:bg-gray-800 odd:bg-white odd:dark:bg-gray-900 hover:bg-gray-100 hover:dark:bg-gray-700">
        <td className="flex items-center col-span-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(service?.id)}
            className="w-4 h-4 accent-[#B72D2D] rounded border-gray-300 dark:border-gray-600 text-[#B72D2D] focus:ring-2 focus:ring-[#B72D2D]"
          />
        </td>
        <td className="font-medium col-span-6 flex items-center justify-start text-center ">
          {service?.name}
        </td>
        <td className="font-medium col-span-2 flex items-center justify-center text-center    ">
          {service?.department?.name}
        </td>
        <td className="text-gray-600 col-span-2 dark:text-gray-400 flex items-center justify-center text-center ">
          {formatDate(service?.createdAt)}
        </td>
        <td className="text-gray-600 col-span-2 dark:text-gray-400 flex items-center justify-center text-center ">
          {formatDate(service?.updatedAt)}
        </td>
        <td
          className={` col-span-1  flex items-center justify-center text-center rounded-lg ${getStatusFlagColor(service?.isActive)} `}
        >
          {service?.isActive ? "Active" : "In Active"}
        </td>

        <td className="flex items-center justify-center col-span-1">
          <ActionsMenu
            actions={[
              {
                label: "Edit",
                icon: <EditIcon />,
                onClick: onEdit,
              },
              {
                label: "Delete",
                icon: <TrashIcon />,
                onClick: onDelete,
                variant: "danger",
              },
            ]}
          />
        </td>
      </tr>

      {/* <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={project.id}
      />

      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteClose}
        projectId={project.id}
        project={project}
      /> */}
    </>
  );
}
