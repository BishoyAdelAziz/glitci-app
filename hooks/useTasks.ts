import {
  getTasks,
  createTasks,
  updateTaskStatus,
  updateTask,
  deleteTask,
} from "@/services/api/tasks";
import type {
  TasksQueryParams,
  TaskStatus,
  CreateTasksBody,
  UpdateTaskPayload,
} from "@/types/tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";


export default function useTasks(params?: TasksQueryParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["tasks", params],
    queryFn: () => getTasks(params),
    placeholderData: (prev) => prev,
  });

  const {
    mutate: CreateTasksMutation,
    isPending: CreateTasksIsPending,
    isError: CreateTasksIsError,
    error: CreateTasksError,
  } = useMutation({
    mutationFn: (body: CreateTasksBody) => createTasks(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const {
    mutate: UpdateStatusMutation,
    isPending: UpdateStatusIsPending,
    isError: UpdateStatusIsError,
    error: UpdateStatusError,
  } = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskAnalytics"] });
    },
  });

  // ─── Update Task ───────────────────────────────────────────────────────────────

  const {
    mutate: UpdateTaskMutation,
    isPending: UpdateTaskIsPending,
    isError: UpdateTaskIsError,
    error: UpdateTaskError,
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskPayload }) =>
      updateTask({ id, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  // ─── Delete Task ───────────────────────────────────────────────────────────────

  const {
    mutate: DeleteTaskMutation,
    isPending: DeleteTaskIsPending,
    isError: DeleteTaskIsError,
    error: DeleteTaskError,
  } = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["taskAnalytics"] });
    },
  });

  return {
    tasks: data?.data ?? [],
    pagination: data
      ? {
          totalPages:
            data.totalPages > 1
              ? data.totalPages
              : Math.ceil((data.results || 0) / (data.limit || 10)) || 1,
          currentPage: data.page,
          limit: data.limit,
          results: data.results,
        }
      : undefined,
    isLoading,
    isError,
    error,
    refetch,
    // Create
    CreateTasksMutation,
    CreateTasksIsPending,
    CreateTasksIsError,
    CreateTasksError,
    // Status Update
    UpdateStatusMutation,
    UpdateStatusIsPending,
    UpdateStatusIsError,
    UpdateStatusError,
    // Update Task
    UpdateTaskMutation,
    UpdateTaskIsPending,
    UpdateTaskIsError,
    UpdateTaskError,
    // Delete Task
    DeleteTaskMutation,
    DeleteTaskIsPending,
    DeleteTaskIsError,
    DeleteTaskError,
  };
}
