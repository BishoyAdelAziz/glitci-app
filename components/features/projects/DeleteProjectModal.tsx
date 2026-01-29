import Modal from "@/components/ui/Modal";
import { Project } from "@/types/projects";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string | null;
  project: Project;
}
export default function DeleteProjectModal({
  isOpen,
  onClose,
  projectId,
  project,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
        <div className="text-xs font-medium text-red-500 w-20 h-20">
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            className="w-full h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this project?
        </p>
        <p>
          once you delete Project{" "}
          <span className="text-red-600 stroke-red-400">{project.name}</span>{" "}
          you cannot retrive it{" "}
        </p>
        <div className="w-full flex items-center justify-evenly">
          <button onClick={onClose}>Cancle</button>
          <button>Delete</button>
        </div>
      </div>
    </Modal>
  );
}
