import {
  getTasks,
  createTasks,
  updateTaskStatus,
} from "@/services/api/tasks";
import type {
  TasksQueryParams,
  TaskStatus,
  CreateTasksBody,
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

  return {
    tasks: data?.data ?? [],
    pagination: data
      ? {
          totalPages: data.totalPages,
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
  };
}
