"use client";

import type { Task, TaskStatus } from "@/types/tasks";
import TaskStatusBadge from "./TaskStatusBadge";

// ─── Helpers ────────────────────────────────────────────────────────────────────

function formatDeadline(endTime: string) {
  const date = new Date(endTime);
  const now = new Date();
  const isOverdue = date < now;

  const formatted = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return { formatted, isOverdue };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string) {
  const colors = [
    "bg-rose-500",
    "bg-blue-500",
    "bg-emerald-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-cyan-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// ─── Task Type Icon ─────────────────────────────────────────────────────────────

function TaskTypeIcon() {
  return (
    <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
      <svg
        className="w-4 h-4 text-gray-500"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────────

interface Props {
  tasks: Task[];
  isAdmin: boolean;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  isUpdating?: boolean;
}

export default function TaskTable({
  tasks,
  isAdmin,
  onStatusChange,
  isUpdating = false,
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
        <div className="col-span-5">Task Details</div>
        <div className="col-span-2">Assigned To</div>
        <div className="col-span-2">Project / Dept</div>
        <div className="col-span-1">Deadline</div>
        <div className="col-span-2 text-right">Status</div>
      </div>

      {/* Rows */}
      {tasks.map((task, index) => {
        const { formatted, isOverdue } = formatDeadline(task.endTime);
        const assigneeName = task.assignedTo?.name ?? "Unassigned";
        const deptName = task.assignedTo?.department?.name ?? "—";
        const projectName = task.project?.name ?? "—";

        return (
          <div
            key={task._id}
            className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 items-center transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/30 ${
              index % 2 === 0
                ? "bg-[#FAFAFA] dark:bg-gray-900"
                : "bg-white dark:bg-gray-900/70"
            }`}
          >
            {/* Task Details */}
            <div className="col-span-5 flex items-center gap-3 min-w-0">
              <TaskTypeIcon />
              <div className="min-w-0">
                <p className="font-semibold text-sm truncate">{task.name}</p>
                {task.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                    {task.description}
                  </p>
                )}
              </div>
            </div>

            {/* Assigned To */}
            <div className="col-span-2 flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${getAvatarColor(assigneeName)}`}
              >
                {getInitials(assigneeName)}
              </div>
              <span className="text-sm truncate">{assigneeName}</span>
            </div>

            {/* Project / Dept */}
            <div className="col-span-2 min-w-0">
              <p className="text-sm font-medium truncate">{projectName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {deptName}
              </p>
            </div>

            {/* Deadline */}
            <div className="col-span-1">
              <span
                className={`text-sm font-medium ${
                  isOverdue && task.status !== "completed"
                    ? "text-red-500"
                    : ""
                }`}
              >
                {isOverdue && task.status !== "completed" && (
                  <span className="mr-1">⚠</span>
                )}
                {formatted}
              </span>
            </div>

            {/* Status */}
            <div className="col-span-2 flex justify-end">
              <TaskStatusBadge
                status={task.status}
                isAdmin={isAdmin}
                onStatusChange={(newStatus) =>
                  onStatusChange(task._id, newStatus)
                }
                isPending={isUpdating}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
