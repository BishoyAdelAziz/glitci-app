// ==================== types/project.ts ====================

export type ProjectStatus =
  | "planning"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

export type ProjectPriority = "low" | "medium" | "high";

export interface Project {
  id: string;
  name: string;
  client: string;
  startDate: string; // ISO 8601 date string
  endDate: string; // ISO 8601 date string
  status: ProjectStatus;
  priority: ProjectPriority;
  employeeCount: number;
}

// Optional: Extended interface with computed/additional fields
export interface ProjectExtended extends Project {
  employees?: Employee[];
  description?: string;
  currency?: string;
  amount?: number;
  department?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Employee {
  id: string | number;
  name: string;
  avatar?: string | null;
  role?: string;
}

// API Response types
export interface ProjectsResponse {
  data: Project[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SingleProjectResponse {
  data: Project;
}

// Filter types
export interface ProjectFilters {
  page?: number;
  limit?: number;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  client?: string;
  department?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

// Form types
export interface CreateProjectInput {
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  description?: string;
  department?: string;
  employeeIds?: string[];
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  id: string;
}
