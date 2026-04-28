export interface Employee {
  id: string;
  user: User;
  employmentType: string;
  department: Department;
  position: Position;
  skills: Skill[];
  createdAt: string;
  updatedAt: string;
}

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

// For the API response wrapper
export interface EmployeeResponse {
  data: Employee;
}
