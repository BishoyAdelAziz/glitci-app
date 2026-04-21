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