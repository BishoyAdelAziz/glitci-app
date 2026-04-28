"use client";

import { Dispatch, SetStateAction, useState } from "react";
import useTasks from "@/hooks/useTasks";
import useUser from "@/hooks/useUser";
import TaskFiltersBar, { type TaskFilters } from "./TaskFiltersBar";
import TaskTable from "./TaskTable";
import CreateTaskModal from "./CreateTaskModal";
import EditTaskModal from "./EditTaskModal";
import DeleteTaskModal from "./DeleteTaskModal";
import StackedPagination from "@/components/ui/Pagination";
import type { Task, TaskStatus } from "@/types/tasks";
import toast from "react-hot-toast";


// ─── Status Metric Card ────────────────────────────────────────────────────────

function MetricCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-lg shadow-black/5 dark:shadow-lg dark:shadow-white/5 flex-1 min-w-[140px] relative overflow-hidden">
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 ${color} rounded-r-full`}
      />
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
        {label}
      </p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function TasksContainer({ isOpen, setIsOpen }: Props) {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TaskFilters>({});
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { user } = useUser();

  const isAdmin = user?.role === "admin" || user?.role === "operation";

  const handleSetFilters: Dispatch<SetStateAction<TaskFilters>> = (val) => {
    setFilters(val);
    setPage(1); // Reset page on filter change
  };

  const {
    tasks,
    isLoading,
    isError,
    pagination,
    UpdateStatusMutation,
    UpdateStatusIsPending,
  } = useTasks({
    ...filters,
    page,
    limit: filters.limit || 10,
  });

  // ── Status counts from current page data ──
  const statusCounts = tasks.reduce(
    (acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    UpdateStatusMutation(
      { id: taskId, status: newStatus },
      {
        onSuccess: () => { toast.success("Status updated!"); },
        onError: (err: any) => { toast.error(err?.response?.data?.message || "Failed to update status"); },
      },
    );
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsEditOpen(true);
  };

  const handleDelete = (task: Task) => {
    setSelectedTask(task);
    setIsDeleteOpen(true);
  };

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
        </div>
      </div>
    );
  }

  // ── Error ──
  if (isError) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl p-8">
        <div className="text-center text-red-600 dark:text-red-400">
          Error loading tasks. Please try again.
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Metric Cards */}
      <div className="flex flex-wrap gap-4 mb-6">
        <MetricCard
          label="Total Tasks"
          value={pagination?.results ?? tasks.length}
          color="bg-gray-400"
        />
        <MetricCard
          label="Pending"
          value={statusCounts["pending"] || 0}
          color="bg-amber-500"
        />
        <MetricCard
          label="In Progress"
          value={statusCounts["in progress"] || 0}
          color="bg-blue-500"
        />
        <MetricCard
          label="Postponed"
          value={statusCounts["postponed"] || 0}
          color="bg-orange-500"
        />
        <MetricCard
          label="Completed"
          value={statusCounts["completed"] || 0}
          color="bg-emerald-500"
        />
      </div>

      {/* Filters */}
      {isAdmin && (
        <div className="mb-6">
          <TaskFiltersBar filters={filters} setFilters={handleSetFilters} />
        </div>
      )}

      {/* Table */}
      <TaskTable
        tasks={tasks}
        isAdmin={isAdmin}
        onStatusChange={handleStatusChange}
        isUpdating={UpdateStatusIsPending}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Pagination */}
      <div className="w-full flex items-center justify-center mt-[5vh]">
        <StackedPagination
          currentPage={pagination?.currentPage}
          limit={pagination?.limit}
          total={pagination?.totalPages}
          onChange={(p) => setPage(p)}
        />
      </div>

      {/* Create Modal */}
      <CreateTaskModal isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* Edit / Delete Modals */}
      {selectedTask && (
        <>
          <EditTaskModal
            isOpen={isEditOpen}
            setIsOpen={setIsEditOpen}
            task={selectedTask}
            setSelectedTask={setSelectedTask}
          />
          <DeleteTaskModal
            isOpen={isDeleteOpen}
            setIsOpen={setIsDeleteOpen}
            task={selectedTask}
            setSelectedTask={setSelectedTask}
          />
        </>
      )}
    </>
  );
}
