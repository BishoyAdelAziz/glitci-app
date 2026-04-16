import axiosInstance from "@/lib/axios";
import type {
  ProjectsQueryParams,
  ProjectsResponse,
  Project,
  SingleProject,
  UpdateProjectDto,
} from "@/types/projects";
import { ProjectFormData } from "../validations/project";
import { ParamValue } from "next/dist/server/request/params";

export const getProjects = async (
  params?: ProjectsQueryParams,
): Promise<ProjectsResponse> => {
  const response = await axiosInstance.get("/projects", { params });
  return response.data;
};

export const getProjectById = async (
  id: string | ParamValue,
): Promise<SingleProject> => {
  const response = await axiosInstance.get(`/projects/${id}`);
  return response.data.data;
};

export const createProject = async (
  data: Partial<ProjectFormData>,
): Promise<Project> => {
  const response = await axiosInstance.post("/projects", data);
  return response.data;
};

export const updateProject = async (
  id: string,
  data: Partial<UpdateProjectDto>,
): Promise<Project> => {
  const response = await axiosInstance.patch(`/projects/${id}`, data);
  return response.data.data;
};

export const deleteProject = async (id: string | null): Promise<void> => {
  await axiosInstance.delete(`/projects/${id}`);
};
