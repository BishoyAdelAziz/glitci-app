"use client";

import { createPortal } from "react-dom";
import type { TaskStatus } from "@/types/tasks";
import { usePortalPosition } from "@/hooks/Useportalpisition";

// ─── Status Configuration ───────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  pending: {
    label: "Pending",
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  "in progress": {
    label: "In Progress",
    bg: "bg-blue-50 dark:bg-blue-950/30",
    text: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  postponed: {
    label: "Postponed",
    bg: "bg-orange-50 dark:bg-orange-950/30",
    text: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  completed: {
    label: "Completed",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  "in review": {
    label: "In Review",
    bg: "bg-purple-50 dark:bg-purple-950/30",
    text: "text-purple-600 dark:text-purple-400",
    dot: "bg-purple-500",
  },
};

// Admin can set any status; employee can only move forward one step
const ADMIN_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  pending: ["in progress", "postponed", "completed", "in review"],
  "in progress": ["pending", "postponed", "completed", "in review"],
  "in review": ["pending", "in progress", "postponed", "completed"],
  postponed: ["pending", "in progress", "completed", "in review"],
  completed: ["pending", "in progress", "postponed", "in review"],
};

const EMPLOYEE_TRANSITIONS: Record<TaskStatus, TaskStatus | null> = {
  pending: "in progress",
  "in progress": "in review",
  "in review": "completed",
  postponed: null,
  completed: null,
};

// ─── Component ──────────────────────────────────────────────────────────────────

interface Props {
  status: TaskStatus;
  isAdmin: boolean;
  onStatusChange: (newStatus: TaskStatus) => void;
  isPending?: boolean;
}

export default function TaskStatusBadge({
  status,
  isAdmin,
  onStatusChange,
  isPending = false,
}: Props) {
  const { triggerRef, isOpen, toggle, close, rect } = usePortalPosition<HTMLDivElement>();
  const config = STATUS_CONFIG[status];

  // ── Employee: single action button ──
  if (!isAdmin) {
    const nextStatus = EMPLOYEE_TRANSITIONS[status];
    if (!nextStatus) {
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${config.bg} ${config.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
          {config.label}
        </span>
      );
    }

    const nextConfig = STATUS_CONFIG[nextStatus];
    return (
      <button
        onClick={() => onStatusChange(nextStatus)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all hover:scale-105 active:scale-95 ${nextConfig.bg} ${nextConfig.text} ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
      >
        {status === "pending"
          ? "▶ Start Task"
          : status === "in progress"
            ? "🔍 Submit for Review"
            : "✓ Complete"}
      </button>
    );
  }

  // ── Admin: clickable dropdown ──
  const transitions = ADMIN_TRANSITIONS[status];

  return (
    <div ref={triggerRef} className="relative inline-block">
      <button
        onClick={toggle}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide transition-all ${config.bg} ${config.text} ${isPending ? "opacity-50 cursor-wait" : "cursor-pointer hover:shadow-md"}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {config.label}
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && createPortal(
        <div
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          style={{
            position: "fixed",
            zIndex: 2147483647,
            right: window.innerWidth - (rect.left + rect.width),
            ...(rect.openUpward
              ? { bottom: window.innerHeight - rect.top, marginBottom: "4px" }
              : { top: rect.top, marginTop: "4px" }),
          }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden min-w-36 py-1 border border-gray-100 dark:border-gray-700"
        >
          {transitions.map((s) => {
            const c = STATUS_CONFIG[s];
            return (
              <button
                key={s}
                onClick={() => {
                  onStatusChange(s);
                  close();
                }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                <span className={c.text}>{c.label}</span>
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </div>
  );
}
