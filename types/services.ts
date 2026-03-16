export interface ServiceDepartment {
  id: string;
  name: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  department: ServiceDepartment;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ServicesQueryParams {
  page?: number;
  limit?: number;
  department?: string; // department id
  isActive?: boolean;
  name?: string;
}

export interface ServicesResponse {
  totalPages: number;
  page: number;
  limit: number;
  results: number;
  data: Service[];
}
