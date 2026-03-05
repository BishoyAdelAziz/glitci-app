// ─── Enums / Unions ───────────────────────────────────────────────────────────

export type Currency = "EGP" | "USD" | "EUR" | "GBP";
export type ProjectStatus = "planning" | "active" | "on_hold" | "completed";
export type ProjectPriority = "low" | "medium" | "high";
export type EmploymentType = "full_time" | "part_time" | "freelancer";

// ─── Nested Entities ──────────────────────────────────────────────────────────

export interface ProjectClient {
  _id: string;
  name: string;
  companyName: string;
  email: string;
  phones: string[];
}

export interface ProjectDepartment {
  _id: string;
  name: string;
}

export interface ProjectService {
  _id: string;
  name: string;
  description: string;
}

export interface ProjectEmployee {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  employmentType: EmploymentType;
  compensation: number;
  currency: Currency;
  assignedAt: string;
}

export interface BudgetConverted {
  amount: number;
  currency: Currency;
}

export interface CreatedBy {
  _id: string;
  name: string;
  email: string;
}

// ─── Root ─────────────────────────────────────────────────────────────────────

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

export interface SingleProjectResponse {
  data: SingleProject;
}
