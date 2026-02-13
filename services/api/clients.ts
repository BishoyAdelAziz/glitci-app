import axiosInstance from "@/lib/axios";

import { ClientsQueryParams, ClientsResponse } from "@/types/clients";
import { AddClientSchema } from "../validations/clients";
export const getClients = async (
  params?: ClientsQueryParams,
): Promise<ClientsResponse> => {
  const response = await axiosInstance.get("/clients", { params });
  return response.data;
};
export const AddClient = async (data: AddClientSchema) => {
  const response = await axiosInstance.post("/clients", data);
  return response.data;
};
