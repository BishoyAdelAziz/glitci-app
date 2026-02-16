// Single position department (nested in position)
export interface PositionDepartment {
  id: string;
  name: string;
}

// Single position response (from getPositionById)
export interface SinglePosition {
  id: string;
  name: string;
  description: string;
  department: PositionDepartment;
  createdAt: string;
  updatedAt: string;
}

// List position response (from getPositions - same as single in this case)
export interface Position {
  id: string;
  name: string;
  description: string;
  department: PositionDepartment;
  createdAt: string;
  updatedAt: string;
}

// Query parameters for filtering positions
export interface PositionsQueryParams {
  page?: number;
  limit?: number;
  name?: string;
  department?: string; // department id
}

// API response structure
export interface PositionsResponse {
  totalPages: number;
  page: number;
  limit: number;
  results: number;
  data: Position[];
}

// DTO for creating a new position
export interface CreatePositionDto {
  name: string;
  description: string;
  department: string; // department id
}

// DTO for updating a position
export interface UpdatePositionDto {
  name?: string;
  description?: string;
  department?: string; // department id
}

// Alias for backward compatibility
export type PositionFilters = PositionsQueryParams;
