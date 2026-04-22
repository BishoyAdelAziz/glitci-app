import axiosInstance from "@/lib/axios";
import { SingleProjectResponse } from "@/types/SingleProject";
import { ParamValue } from "next/dist/server/request/params";

export const getSingleProject = async (
  id: string,
): Promise<SingleProjectResponse> => {
  const response = await axiosInstance.get<SingleProjectResponse>(
    `/projects/${id}`,
  );
  return response.data;
};
export const getSingleProjectFinance = async (id: ParamValue) => {
  const response = await axiosInstance.get(`/finance/project/${id}`);
  return response.data;
};
export const getSingleProjectEmployeesBreakDown = async (id: ParamValue) => {
  const response = await axiosInstance.get(`/finance/project/${id}/payments/employees`);
  return response.data;
};
export const getSingleProjectExpensesBreakDown = async (id: ParamValue) => {
  const response = await axiosInstance.get(`/finance/project/${id}/expenses/other`);
  return response.data;
};
export const getSingleProjectClientPaymentHistory = async(id: ParamValue) => {
  const response = await axiosInstance.get(`/finance/project/${id}/payments/client`);
  return response.data;
}