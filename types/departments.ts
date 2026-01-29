export interface Department {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentsQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  isActive?: boolean;
}

export interface DepartmentsResponse {
  totalPages: number;
  page: number;
  limit: number;
  results: number;
  data: Department[];
}
