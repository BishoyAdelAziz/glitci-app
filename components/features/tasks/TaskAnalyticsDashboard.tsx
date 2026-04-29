"use client";

import { useState } from "react";
import useTaskAnalytics from "@/hooks/useTaskAnalytics";
import useEmployees from "@/hooks/useEmployees";
import useProjects from "@/hooks/useProjects";
import type { AnalyticsQueryParams, TaskStatus } from "@/types/tasks";
import TaskStatusBadge from "./TaskStatusBadge";
import Link from "next/link";

// ─── Filter Dropdown (Compact) ──────────────────────────────────────────────────

function CompactFilter({
  label,
  icon,
  options,
  value,
  onChange,
}: {
  label: string;
  icon: React.ReactNode;
  options: { id: string; name: string }[];
  value?: string;
  onChange: (v?: string) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="appearance-none bg-white dark:bg-gray-800 rounded-xl px-4 py-2.5 pr-8 text-sm font-medium cursor-pointer outline-none transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}

// ─── Metric Card ────────────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  icon,
  color,
  hoverBg,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  hoverBg: string;
}) {
  return (
    <div
      className={`bg-white dark:bg-gray-900 border border-gray-50 dark:border-gray-800 rounded-2xl p-5 relative overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl hover:border-transparent group ${hoverBg}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}
        >
          {icon}
        </div>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
        {label}
      </p>
      <p className="text-2xl font-black mt-0.5 tracking-tight group-hover:scale-105 origin-left transition-transform duration-500">
        {value.toLocaleString()}
      </p>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────────

export default function TaskAnalyticsDashboard() {
  const [params, setParams] = useState<AnalyticsQueryParams>({});
  const { analytics, isLoading, isError } = useTaskAnalytics(params);
  const { employees } = useEmployees();
  const { projects } = useProjects();

  const employeeOptions =
    employees?.map((e: any) => ({ id: e._id || e.id, name: e.name })) ?? [];
  const projectOptions =
    projects?.map((p: any) => ({ id: p._id || p.id, name: p.name })) ?? [];

  const completionRate = analytics?.completionRate ?? 0;
  const rateColor =
    completionRate >= 70
      ? "from-emerald-500 to-emerald-600"
      : completionRate >= 40
        ? "from-amber-500 to-amber-600"
        : "from-red-500 to-red-600";

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Task Analytics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Overview of team performance and project health.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={params.startDate || ""}
              onChange={(e) =>
                setParams((p) => ({
                  ...p,
                  startDate: e.target.value || undefined,
                }))
              }
              className="bg-white dark:bg-gray-800 rounded-xl px-3 py-2.5 text-sm outline-none"
              placeholder="Start"
            />
            <span className="text-gray-400 text-sm">→</span>
            <input
              type="date"
              value={params.endDate || ""}
              onChange={(e) =>
                setParams((p) => ({
                  ...p,
                  endDate: e.target.value || undefined,
                }))
              }
              className="bg-white dark:bg-gray-800 rounded-xl px-3 py-2.5 text-sm outline-none"
              placeholder="End"
            />
          </div>

          <CompactFilter
            label="All Employees"
            icon={null}
            options={employeeOptions}
            value={params.employee}
            onChange={(v) => setParams((p) => ({ ...p, employee: v }))}
          />
          <CompactFilter
            label="All Projects"
            icon={null}
            options={projectOptions}
            value={params.project}
            onChange={(v) => setParams((p) => ({ ...p, project: v }))}
          />
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
        </div>
      )}

      {isError && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center text-red-500">
          Failed to load analytics. Please try again.
        </div>
      )}

      {analytics && !isLoading && (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <MetricCard
              label="Total Tasks"
              value={analytics.totalTasks}
              color="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
              hoverBg="hover:bg-gray-50/80 dark:hover:bg-gray-800/50"
              icon={
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
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
            />
            <MetricCard
              label="Completed"
              value={analytics.completed}
              color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
              hoverBg="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10"
              icon={
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
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <MetricCard
              label="In Progress"
              value={analytics.inProgress}
              color="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
              hoverBg="hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
              icon={
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              }
            />
            <MetricCard
              label="In Review"
              value={analytics.inReview}
              color="bg-purple-100 dark:bg-purple-900/30 text-purple-600"
              hoverBg="hover:bg-purple-50/50 dark:hover:bg-purple-900/10"
              icon={
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              }
            />
            <MetricCard
              label="Pending"
              value={analytics.pending}
              color="bg-amber-100 dark:bg-amber-900/30 text-amber-600"
              hoverBg="hover:bg-amber-50/50 dark:hover:bg-amber-900/10"
              icon={
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
            <MetricCard
              label="Postponed"
              value={analytics.postponed}
              color="bg-orange-100 dark:bg-orange-900/30 text-orange-600"
              hoverBg="hover:bg-orange-50/50 dark:hover:bg-orange-900/10"
              icon={
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
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              }
            />
          </div>

          {/* Completion Rate Banner */}
          <div className="bg-gray-900 dark:bg-white rounded-3xl p-8 text-white dark:text-gray-900 mb-8 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                  Overall Completion Rate
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-6xl font-black">{completionRate}%</h3>
                  <span className="text-lg text-gray-400">
                    of total workload
                  </span>
                </div>
              </div>
              <div className="flex-1 max-w-md w-full">
                <div className="h-4 bg-gray-800 dark:bg-gray-100 rounded-full overflow-hidden p-1">
                  <div
                    className={`h-full rounded-full bg-linear-to-r ${rateColor} transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(0,0,0,0.3)]`}
                    style={{ width: `${Math.min(completionRate, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] mt-3 font-medium text-gray-400 dark:text-gray-500 text-right uppercase tracking-tighter">
                  Team productivity tracking enabled
                </p>
              </div>
            </div>
            {/* Background Decoration */}
            <div
              className={`absolute -right-20 -top-20 w-64 h-64 bg-linear-to-br ${rateColor} opacity-10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125`}
            />
          </div>

          {/* Breakdown Table */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <h2 className="font-bold text-lg">Recent Task Breakdown</h2>
              <Link
                href="/tasks"
                className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                View Full Report
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>

            {/* Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <div className="col-span-4">Task Name</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Assigned To</div>
              <div className="col-span-2">Department</div>
              <div className="col-span-2">Project</div>
            </div>

            {/* Rows */}
            {analytics.tasks?.map((task, i) => (
              <div
                key={task._id}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center ${
                  i % 2 === 0
                    ? "bg-[#FAFAFA] dark:bg-gray-900"
                    : "bg-white dark:bg-gray-900/70"
                }`}
              >
                <div className="col-span-4">
                  <p className="text-sm font-medium truncate">{task.name}</p>
                </div>
                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide ${
                      task.status === "completed"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                        : task.status === "in progress"
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                          : task.status === "in review"
                            ? "bg-purple-50 text-purple-600 dark:bg-purple-950/30 dark:text-purple-400"
                            : task.status === "pending"
                              ? "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                              : task.status === "postponed"
                                ? "bg-orange-50 text-orange-600 dark:bg-orange-950/30 dark:text-orange-400"
                                : "bg-gray-50 text-gray-600 dark:bg-gray-950/30 dark:text-gray-400"
                    }`}
                  >
                    {task.status.toUpperCase()}
                  </span>
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white text-[9px] font-bold shrink-0">
                    {task.assignedTo?.user?.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <span className="text-sm truncate">
                    {task.assignedTo?.user?.name ?? "—"}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-gray-600 dark:text-gray-400 truncate">
                  {task.assignedTo?.department?.name ?? "—"}
                </div>
                <div className="col-span-2 text-sm truncate">
                  {task.project?.name ?? "—"}
                </div>
              </div>
            ))}

            {(!analytics.tasks || analytics.tasks.length === 0) && (
              <div className="px-6 py-8 text-center text-sm text-gray-500">
                No tasks match the selected filters.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
