import axiosInstance from "@/lib/axios";
import { ServicesQueryParams, ServicesResponse } from "@/types/services";

export const getServices = async (
  params?: ServicesQueryParams,
): Promise<ServicesResponse> => {
  const response = await axiosInstance.get("/services", { params });
  return response.data;
};
