import axiosInstance from "@/lib/axios";
import {
  DepartmentsQueryParams,
  DepartmentsResponse,
} from "@/types/departments";

export const getDepartments = async (
  params?: DepartmentsQueryParams,
): Promise<DepartmentsResponse> => {
  const response = await axiosInstance.get("/departments", { params });
  return response.data;
};
