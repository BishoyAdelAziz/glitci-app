export interface Client {
  id: string;
  name: string;
  companyName: string;
  email: string;
  phones: string[];
  industry: string;
  notes: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientsQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  companyName?: string;
  industry?: string;
  isActive?: boolean;
}

export interface ClientsResponse {
  totalPages: number;
  page: number;
  limit: number;
  results: number;
  data: Client[];
}
