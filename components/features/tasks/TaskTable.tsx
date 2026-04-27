"use client";

import type { Task, TaskStatus } from "@/types/tasks";
import TaskRow from "./TaskRow";

interface Props {
  tasks: Task[];
  isAdmin: boolean;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  isUpdating?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export default function TaskTable({
  tasks,
  isAdmin,
  onStatusChange,
  isUpdating = false,
  onEdit,
  onDelete,
}: Props) {
  if (!tasks.length) {
    return (
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-12 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
        </div>
        <h3 className="font-semibold text-lg mb-1">No tasks found</h3>
        <p className="text-sm text-gray-500">
          Try adjusting your filters or create a new task.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        <div className="col-span-4">Task Details</div>
        <div className="col-span-2">Assigned To</div>
        <div className="col-span-2">Project / Dept</div>
        <div className="col-span-2">Deadline</div>
        <div className="col-span-1 text-center">Status</div>
        {isAdmin && <div className="col-span-1 text-right">Actions</div>}
      </div>

      {/* Rows */}
      {tasks.map((task, index) => (
        <TaskRow
          key={task._id || (task as any).id}
          task={task}
          index={index}
          isAdmin={isAdmin}
          onStatusChange={onStatusChange}
          isUpdating={isUpdating}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
