import Modal from "@/components/ui/Modal";
import useEmployees from "@/hooks/useEmployees";
import { Employee } from "@/types/employees";
import { Dispatch, SetStateAction } from "react";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  employee: Employee;
  onClose: () => void;
}
export default function DeleteEMployeeModal({
  isOpen,
  setIsOpen,
  employee,
  onClose,
}: Props) {
  const {
    DeleteEMployeeError,
    DeleteEMployeeIsError,
    DeleteEMployeeIsPending,
    DeleteEMployeeMutation,
  } = useEmployees();
  const handleDelete = (employeeId: string) => {
    DeleteEMployeeMutation(employeeId, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 space-y-6">
        <div className="text-red-500 w-20 h-20">
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

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Delete Employee
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600">
              {employee?.user.name}
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This action cannot be undone.
          </p>
        </div>

        {/* Buttons */}
        <div className="w-full flex items-center justify-center gap-4">
          <button
            onClick={() => setIsOpen(false)}
            disabled={DeleteEMployeeIsPending}
            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={() => handleDelete(employee.id)}
            disabled={DeleteEMployeeIsPending}
            className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-25 justify-center"
          >
            {DeleteEMployeeIsPending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
