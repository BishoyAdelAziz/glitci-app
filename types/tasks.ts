// ─── Task Status ────────────────────────────────────────────────────────────────

export type TaskStatus = "pending" | "in progress" | "in review" | "postponed" | "completed";

// ─── Populated Sub-Types ────────────────────────────────────────────────────────

export interface TaskAssignedTo {
  _id?: string;
  id?: string;
  name?: string;
  user?: {
    _id?: string;
    id?: string;
    name: string;
  };
  department?: {
    _id?: string;
    id?: string;
    name: string;
  };
}

export interface TaskProject {
  _id: string;
  name: string;
}

export interface TaskCreatedBy {
  _id: string;
  name: string;
}

export interface TaskHistoryEntry {
  status: string;
  changedAt: string;
  changedBy: string;
  changedByName?: string;
  description: string;
}

// ─── Task Link ──────────────────────────────────────────────────────────────────

export interface TaskLink {
  name: string;
  url: string;
}

// ─── Task Object ────────────────────────────────────────────────────────────────

export interface Task {
  id: string;
  _id?: string;
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  links?: TaskLink[];
  status: TaskStatus;
  assignedTo: TaskAssignedTo;
  project?: TaskProject;
  createdBy: TaskCreatedBy;
  history: TaskHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

// ─── Query Params ───────────────────────────────────────────────────────────────

export interface TasksQueryParams {
  date?: string;
  employee?: string;
  department?: string;
  status?: TaskStatus;
  project?: string;
  page?: number;
  limit?: number;
}

// ─── Paginated Response ─────────────────────────────────────────────────────────

export interface TasksResponse {
  totalPages: number;
  page: number;
  limit: number;
  results: number;
  data: Task[];
}

// ─── Create Task Payload ────────────────────────────────────────────────────────

export interface CreateTaskPayload {
  name: string;
  description?: string;
  startTime: string;
  endTime: string;
  assignedTo: string;
  project?: string;
  links?: TaskLink[];
}

export interface CreateTasksBody {
  tasks: CreateTaskPayload[];
}

export interface CreateTasksResponse {
  message: string;
  count: number;
  data: Task[];
}

// ─── Update Task ─────────────────────────────────────────────────────────────────

export interface UpdateTaskPayload {
  name?: string;
  description?: string;
  assignedTo?: string;
  project?: string;
  links?: TaskLink[];
}

export interface UpdateTaskResponse {
  message: string;
  data: Task;
}

export interface DeleteTaskResponse {
  message: string;
}

// ─── Status Update ──────────────────────────────────────────────────────────────

export interface UpdateStatusBody {
  status: TaskStatus;
}

export interface UpdateStatusResponse {
  message: string;
  data: Task;
}

// ─── Analytics ──────────────────────────────────────────────────────────────────

export interface AnalyticsQueryParams {
  startDate?: string;
  endDate?: string;
  employee?: string;
  project?: string;
}

export interface AnalyticsData {
  totalTasks: number;
  completed: number;
  pending: number;
  inProgress: number;
  inReview: number;
  postponed: number;
  completionRate: number;
  tasks: Task[];
}

export interface AnalyticsResponse {
  data: AnalyticsData;
}
