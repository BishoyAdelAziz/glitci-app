import { ParamValue } from "next/dist/server/request/params";

export type ProjectStatus = "planning" | "active" | "on_hold" | "completed";
export type ProjectPriority = "low" | "medium" | "high";
export type Currency = "EGP" | "SAR" | "AED" | "USD" | "EUR";

export interface BudgetConverted {
  EGP: number;
  SAR: number;
  AED: number;
  USD: number;
  EUR: number;
}

export interface ProjectClient {
  _id: string;
  name: string;
  companyName: string;
}

export interface ProjectDepartment {
  _id: string;
  name: string;
}

export interface ProjectService {
  _id: string;
  name: string;
}

export interface ProjectEmployee {
  id: string;
  name: string;
  email: string;
  assignedAt: string;
  compensation: string;
  phone: string;
  position: string;
  currency: Currency;
}

export interface CreatedBy {
  _id: string;
  name: string;
  email: string;
}

// Single project response (from getProjectById)
export interface SingleProject {
  _id: string;
  name: string;
  description: string;
  client: ProjectClient;
  department: ProjectDepartment;
  services: ProjectService[];
  employees: ProjectEmployee[];
  budget: number;
  budgetConverted: BudgetConverted;
  currency: Currency;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  isActive: boolean;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
}

// List project response (from getProjects - simplified version)
export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  department: {
    id: string;
    name: string;
  };
  services: Array<{
    id: string;
    name: string;
  }>;
  employees: Array<{
    id: string;
    name: string;
  }>;
  budget: number;
  currency: Currency;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  employeeCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsQueryParams {
  page?: number;
  limit?: number;
  client?: string; // client id
  status?: ProjectStatus;
  isActive?: boolean;
  name?: string;
  id?: ParamValue;
}

export interface ProjectsResponse {
  totalPages: number;
  page: number;
  limit: number;
  results: number;
  data: Project[];
}
export interface UpdateProjectDto {
  name?: string;
  budget?: string;
  currency?: Currency;
  status?: ProjectStatus;
  employees?: Array<{
    employee: string;
    compensation: string;
    currency: Currency;
  }>;
}
// Alias for backward compatibility with the hook
export type ProjectFilters = ProjectsQueryParams;
