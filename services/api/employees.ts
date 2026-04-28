import axiosInstance from "@/lib/axios";
import { EmployeesQueryParams, EmployeesResponse } from "@/types/employees";
import { AddEmployeeFormFIelds } from "../validations/employees";
import { ParamValue } from "next/dist/server/request/params";
import { EmployeeResponse } from "@/types/employee";

export const getEmployees = async (
  params?: EmployeesQueryParams,
): Promise<EmployeesResponse> => {
  const response = await axiosInstance.get("/employees", { params });
  return response.data;
};
export const addEmployee = async (data: AddEmployeeFormFIelds) => {
  const response = await axiosInstance.post("/employees", data);
  return response.data;
};
export const updateEmployee = async (
  id: string,
  data: AddEmployeeFormFIelds,
) => {
  const response = await axiosInstance.patch(`/employees/${id}`, data);
  return response.data;
};
export const deleteEmployee = async (employeeId: string) => {
  const response = await axiosInstance.delete(`/employees/${employeeId}`);
  return response.data;
};
export const getSignleEmployee = async (
  employeeId: ParamValue,
): Promise<EmployeeResponse> => {
  const response = await axiosInstance<EmployeeResponse>(
    `/employees/${employeeId}`,
  );
  return response.data;
};
