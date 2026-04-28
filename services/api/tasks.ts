import axiosInstance from "@/lib/axios";
import type {
  TasksQueryParams,
  TasksResponse,
  CreateTasksBody,
  CreateTasksResponse,
  TaskStatus,
  UpdateStatusResponse,
  AnalyticsQueryParams,
  AnalyticsResponse,
  UpdateTaskPayload,
  UpdateTaskResponse,
  DeleteTaskResponse,
} from "@/types/tasks";


// ─── Task List ──────────────────────────────────────────────────────────────────

export const getTasks = async (
  params?: TasksQueryParams,
): Promise<TasksResponse> => {
  const response = await axiosInstance.get("/tasks", { params });
  return response.data;
};

// ─── Bulk Create ────────────────────────────────────────────────────────────────

export const createTasks = async (
  data: CreateTasksBody,
): Promise<CreateTasksResponse> => {
  const response = await axiosInstance.post("/tasks", data);
  return response.data;
};

// ─── Status Update ──────────────────────────────────────────────────────────────

export const updateTaskStatus = async (
  id: string,
  status: TaskStatus,
): Promise<UpdateStatusResponse> => {
  const response = await axiosInstance.patch(`/tasks/${id}/status`, { status });
  return response.data;
};

// ─── Update Task ────────────────────────────────────────────────────────────────

export const updateTask = async ({
  id,
  data,
}: {
  id: string;
  data: UpdateTaskPayload;
}): Promise<UpdateTaskResponse> => {
  const response = await axiosInstance.patch(`/tasks/${id}`, data);
  return response.data;
};

// ─── Delete Task ────────────────────────────────────────────────────────────────

export const deleteTask = async (id: string): Promise<DeleteTaskResponse> => {
  const response = await axiosInstance.delete(`/tasks/${id}`);
  return response.data;
};


// ─── Analytics ──────────────────────────────────────────────────────────────────

export const getTaskAnalytics = async (
  params?: AnalyticsQueryParams,
): Promise<AnalyticsResponse> => {
  const response = await axiosInstance.get("/tasks/analytics/summary", {
    params,
  });
  return response.data;
};
