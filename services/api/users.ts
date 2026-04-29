import axiosInstance from "@/lib/axios";
import { UsersEmployeesQueryParamsuery, UsersResponse } from "@/types/users";

export const getUsers = async (
  params?: UsersEmployeesQueryParamsuery,
): Promise<UsersResponse> => {
  const response = await axiosInstance("/users", { params });
  return response.data;
};
export const AddUser = async (data: {
  name: string;
  email: string;
  role: string;
}) => {
  const response = await axiosInstance.post("/users", data);
  return response.data;
};
export const UpdateUser = async (data: {
  name: string;
  email: string;
  role: string;
  id: string;
}) => {
  const { id, ...rest } = data;
  const response = await axiosInstance.patch(`/users/${id}`, rest);
  return response.data;
};
export const DeleteUser = async (id: string) => {
  const response = await axiosInstance.delete(`/users/${id}`);
  return response.data;
};
