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

interface TaskRowProps {
  task: Task;
  index: number;
  isAdmin: boolean;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  isUpdating?: boolean;
}

export default function TaskRow({
  task,
  index,
  isAdmin,
  onStatusChange,
  isUpdating = false,
}: TaskRowProps) {
  const { formatted, isOverdue } = formatDeadline(task.endTime);
  const assigneeName = task.assignedTo?.user?.name ?? "Unassigned";
  const deptName = task.assignedTo?.department?.name ?? "—";
  const projectName = task.project?.name ?? "—";

  return (
    <div
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
            isOverdue && task.status !== "completed" ? "text-red-500" : ""
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
          onStatusChange={(newStatus) => onStatusChange(task._id as string, newStatus)}
          isPending={isUpdating}
        />
      </div>
    </div>
  );
}
