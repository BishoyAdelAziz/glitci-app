import axiosInstance from "@/lib/axios";
import {
  DepartmentsQueryParams,
  DepartmentsResponse,
} from "@/types/departments";
import { AddDepartmentFormFIelds } from "../validations/departments";

export const getDepartments = async (
  params?: DepartmentsQueryParams,
): Promise<DepartmentsResponse> => {
  const response = await axiosInstance.get("/departments", { params });
  return response.data;
};
export const CreateDepartment = async (data) => {
  const response = await axiosInstance.post("/departments", data);
  return response.data;
};
export const DeleteDepartment = async (DepartmentId: string | undefined) => {
  const response = await axiosInstance.delete(`/departments/${DepartmentId}`);
  return response.data;
};
export const UpdateDepartment = async (
  id: string | undefined,
  data: AddDepartmentFormFIelds,
) => {
  const response = await axiosInstance.patch(`/departments/${id}`, data);
  return response.data;
};
