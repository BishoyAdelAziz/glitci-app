import axiosInstance from "@/lib/axios";

import { ClientsQueryParams, ClientsResponse } from "@/types/clients";
export const getClients = async (
  params?: ClientsQueryParams,
): Promise<ClientsResponse> => {
  const response = await axiosInstance.get("/clients", { params });
  return response.data;
};
