import axiosInstance from "@/lib/axios";
import type {
  ProjectFilters,
  ProjectsResponse,
  Project,
} from "@/types/projects";

export const getProjects = async (
  filters?: ProjectFilters,
): Promise<ProjectsResponse> => {
  const response = await axiosInstance.get("/projects", {
    params: {
      page: filters?.page || 1,
      limit: filters?.limit || 10,
      status: filters?.status,
      priority: filters?.priority,
      client: filters?.client,
      department: filters?.department,
      isActive: filters?.isActive,
    },
  });
  return response.data;
};

export const getProjectById = async (id: string): Promise<Project> => {
  const response = await axiosInstance.get(`/projects/${id}`);
  return response.data;
};

export const createProject = async (
  data: Partial<Project>,
): Promise<Project> => {
  const response = await axiosInstance.post("/projects", data);
  return response.data;
};

export const updateProject = async (
  id: string,
  data: Partial<Project>,
): Promise<Project> => {
  const response = await axiosInstance.patch(`/projects/${id}`, data);
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/projects/${id}`);
};
