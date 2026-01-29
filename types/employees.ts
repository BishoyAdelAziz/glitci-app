export type EmployeeTypes = "freelancer" | "full_time" | "part_time";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  phone: string;
  isActive: boolean;
}

export interface Department {
  id: string;
  name: string;
}

export interface Position {
  id: string;
  name: string;
}

export interface Skill {
  id: string;
  name: string;
}

export interface Employee {
  id: string;
  user: User;
  employmentType: EmployeeTypes;
  department: Department;
  position: Position;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

export interface EmployeesQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  employmentType?: EmployeeTypes;
  department?: string; // department id
  position?: string; // position id
  skill?: string; // skill id
  isActive?: boolean;
}

export interface EmployeesResponse {
  totalPages: number;
  page: number;
  limit: number;
  results: number;
  data: Employee[];
}
