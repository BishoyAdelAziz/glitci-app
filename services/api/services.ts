import axiosInstance from "@/lib/axios";
import { ServicesQueryParams, ServicesResponse } from "@/types/services";
import { AddServiceFormFields } from "../validations/services";
import { AxiosRequestConfig } from "axios";

export const getServices = async (
  params?: ServicesQueryParams,
): Promise<ServicesResponse> => {
  const response = await axiosInstance.get("/services", { params });
  return response.data;
};
export const createService = async (
  data: AxiosRequestConfig<AddServiceFormFields>,
) => {
  const response = await axiosInstance.post("/services", data);
  return response.data;
};
export const editService = async ({
  id,
  data,
}: {
  id: string;
  data: AxiosRequestConfig<AddServiceFormFields>;
}) => {
  const response = await axiosInstance.patch(`/services/${id}`, data);
  return response.data;
};
export const deleteService = async (id: string) => {
  const response = await axiosInstance.delete(`/services/${id}`);
  return response.data;
};
