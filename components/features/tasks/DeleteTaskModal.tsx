"use client";

import Modal from "@/components/ui/Modal";
import useTasks from "@/hooks/useTasks";
import type { Task } from "@/types/tasks";
import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  task: Task;
  setSelectedTask: Dispatch<SetStateAction<Task | null>>;
}

export default function DeleteTaskModal({ isOpen, setIsOpen, task, setSelectedTask }: Props) {
  const { DeleteTaskMutation, DeleteTaskIsPending } = useTasks();

  const handleClose = () => {
    setIsOpen(false);
    setSelectedTask(null);
  };

  const handleDelete = () => {
    DeleteTaskMutation(task.id || task._id!, {
      onSuccess: () => {
        toast.success("Task deleted successfully!");
        handleClose();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to delete task");
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      <div className="p-6">
        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-center mb-1">Delete Task</h3>
        <p className="text-sm text-center text-gray-500 dark:text-gray-400 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-gray-700 dark:text-gray-200">"{task.name}"</span>?
          <br />
          This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-3 rounded-[30px] border border-gray-200 dark:border-gray-700 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={DeleteTaskIsPending}
            className="flex-1 py-3 rounded-[30px] bg-red-600 hover:bg-red-700 font-semibold text-white transition-colors disabled:opacity-50 disabled:cursor-wait"
          >
            {DeleteTaskIsPending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
