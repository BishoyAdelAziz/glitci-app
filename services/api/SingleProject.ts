import axiosInstance from "@/lib/axios";
import { SingleProjectResponse } from "@/types/SingleProject";

export const getSingleProject = async (
  id: string,
): Promise<SingleProjectResponse> => {
  const response = await axiosInstance.get<SingleProjectResponse>(
    `/projects/${id}`,
  );
  return response.data;
};
