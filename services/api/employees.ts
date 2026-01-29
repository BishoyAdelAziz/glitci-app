import axiosInstance from "@/lib/axios";
import { EmployeesQueryParams, EmployeesResponse } from "@/types/employees";

export const getEmployees = async (
  params?: EmployeesQueryParams,
): Promise<EmployeesResponse> => {
  const response = await axiosInstance.get("/employees", { params });
  return response.data;
};
