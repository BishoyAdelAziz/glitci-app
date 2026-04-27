import { useState } from "react";
import type { Task, TaskStatus } from "@/types/tasks";
import TaskStatusBadge from "./TaskStatusBadge";
import ActionsMenu, { EditIcon, TrashIcon } from "@/components/ui/ActionsMenu";


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
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export default function TaskRow({
  task,
  index,
  isAdmin,
  onStatusChange,
  isUpdating = false,
  onEdit,
  onDelete,
}: TaskRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { formatted, isOverdue } = formatDeadline(task.endTime);
  const assigneeName = task.assignedTo?.user?.name ?? "Unassigned";
  const deptName = task.assignedTo?.department?.name ?? "—";
  const projectName = task.project?.name ?? "—";

  return (
    <div
      className={`flex flex-col transition-colors ${
        index % 2 === 0
          ? "bg-[#FAFAFA] dark:bg-gray-900"
          : "bg-white dark:bg-gray-900/70"
      } hover:bg-gray-50/50 dark:hover:bg-gray-800/30`}
    >
      {/* Main Row */}
      <div className="grid grid-cols-12 gap-y-4 gap-x-2 md:gap-4 px-4 sm:px-6 py-5 items-center">

        {/* Task Details */}
        <div className="col-span-12 md:col-span-4 flex items-center gap-3 min-w-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500 transition-transform shrink-0"
            style={{ transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)" }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <TaskTypeIcon />
          <div
            className="min-w-0 cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <p className="font-semibold text-sm truncate hover:text-red-500 transition-colors">{task.name}</p>
            {task.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                {task.description}
              </p>
            )}
          </div>
        </div>

        {/* Assigned To */}
        <div className="col-span-6 sm:col-span-4 md:col-span-2 flex flex-col justify-center min-w-0">
          <span className="text-[10px] uppercase text-gray-400 font-bold md:hidden mb-1 tracking-wider">Assignee</span>
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${getAvatarColor(assigneeName)}`}
            >
              {getInitials(assigneeName)}
            </div>
            <span className="text-sm truncate">{assigneeName}</span>
          </div>
        </div>

        {/* Project / Dept */}
        <div className="col-span-6 sm:col-span-4 md:col-span-2 flex flex-col justify-center min-w-0">
          <span className="text-[10px] uppercase text-gray-400 font-bold md:hidden mb-1 tracking-wider">Project</span>
          <p className="text-sm font-medium truncate">{projectName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {deptName}
          </p>
        </div>

        {/* Deadline */}
        <div className="col-span-6 sm:col-span-4 md:col-span-2 flex flex-col justify-center min-w-0 mt-2 sm:mt-0">
          <span className="text-[10px] uppercase text-gray-400 font-bold md:hidden mb-1 tracking-wider">Deadline</span>
          <span
            className={`text-sm font-medium truncate ${
              isOverdue && task.status !== "completed" ? "text-red-500" : ""
            }`}
          >
            {isOverdue && task.status !== "completed" && (
              <span className="mr-1">⚠</span>
            )}
            {formatted}
          </span>
        </div>

        {/* Status — TaskStatusBadge now uses a portal internally */}
        <div className="col-span-9 sm:col-span-10 md:col-span-1 flex flex-col justify-center items-start md:items-center mt-2 sm:mt-0">
          <span className="text-[10px] uppercase text-gray-400 font-bold md:hidden mb-1 tracking-wider">Status</span>
          <TaskStatusBadge
            status={task.status}
            isAdmin={isAdmin}
            onStatusChange={(newStatus) =>
              onStatusChange(task.id || task._id || "", newStatus)
            }
            isPending={isUpdating}
          />
        </div>

        {/* Actions */}
        {isAdmin && (
          <div className="col-span-3 sm:col-span-2 md:col-span-1 flex flex-col justify-center items-end">
            <ActionsMenu
              actions={[
                {
                  label: "Edit",
                  icon: <EditIcon />,
                  onClick: () => onEdit?.(task),
                },
                {
                  label: "Delete",
                  icon: <TrashIcon />,
                  onClick: () => onDelete?.(task),
                  variant: "danger",
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-6 pb-5 pt-2 border-t border-gray-100 dark:border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Meta Data */}
            <div className="lg:col-span-1 space-y-5">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Created By</p>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0 ${getAvatarColor(task.createdBy?.name || "System")}`}
                  >
                    {getInitials(task.createdBy?.name || "System")}
                  </div>
                  <span className="text-sm font-medium">{task.createdBy?.name || "System"}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Created At</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {new Date(task.createdAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              {task.links && task.links.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Attachments / Links</p>
                  <div className="flex flex-wrap gap-2">
                    {task.links.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        {link.name || "Open Link"}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* History Timeline */}
            <div className="lg:col-span-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Task Timeline</p>
              {task.history && task.history.length > 0 ? (
                <div className="space-y-4">
                  {task.history.map((h, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-gray-300 dark:bg-gray-600 mt-1" />
                        {i !== task.history.length - 1 && (
                          <div className="w-px h-full bg-gray-200 dark:bg-gray-700 my-1.5" />
                        )}
                      </div>
                      <div className="pb-2">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                          {h.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs text-gray-500">
                          <span>
                            {new Date(h.changedAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span>{h.changedByName || "System"}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <span
                            className={`uppercase tracking-wider font-bold ${
                              h.status === "completed"
                                ? "text-emerald-500"
                                : h.status === "in progress"
                                ? "text-blue-500"
                                : h.status === "postponed"
                                ? "text-orange-500"
                                : "text-amber-500"
                            }`}
                          >
                            {h.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">No timeline events recorded.</p>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}