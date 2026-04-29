import { ParamValue } from "next/dist/server/request/params";
import { Currency } from "./projects";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string;
  role: string;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
  currency: Currency;
}
export interface UsersEmployeesQueryParamsuery {
  page?: number;
  limit?: number;
  name?: string;
  email?: string;
  isActive?: boolean;
  employeeId?: string | ParamValue;
}
export interface UsersResponse {
  totalPages: number;
  page: number;
  limit: number;
  results: number;
  data: User[];
}
