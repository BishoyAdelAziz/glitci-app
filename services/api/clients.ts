import axiosInstance from "@/lib/axios";

import {
  ClientsQueryParams,
  ClientsResponse,
  SigleClientResponse,
} from "@/types/clients";
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
export const editClient = async ({
  data,
  clientId,
}: {
  data: AddClientSchema;
  clientId: string;
}) => {
  const response = await axiosInstance.patch(`/clients/${clientId}`, data);
  return response.data;
};
export const getSingleClient = async (
  clientId: string | undefined,
): Promise<SigleClientResponse> => {
  const response = await axiosInstance.get(`/clients/${clientId}`);
  return response.data;
};
export const deleteClient = async (clientId: string) => {
  const response = await axiosInstance.delete(`/clients/${clientId}`);
  return response.data;
};
