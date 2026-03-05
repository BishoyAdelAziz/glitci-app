import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
} from "@/services/api/projects";
import type { ProjectsQueryParams, UpdateProjectDto } from "@/types/projects";
import { ProjectFormData } from "@/services/validations/project";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getSingleProject } from "@/services/api/SingleProject";
import id from "zod/v4/locales/id.js";

export default function useProjects(params?: ProjectsQueryParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["projects", params],
    queryFn: () => getProjects(params),
    placeholderData: (prev) => prev,
  });

  const {
    mutate: CreateProjectMutation,
    isPending: CreateProjectIsPending,
    isError: CreateProjectIsError,
    error: CreateProjectError,
  } = useMutation({
    mutationFn: (data: Partial<ProjectFormData>) => createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", params] });
    },
  });

  const {
    mutate: UpdateProjectMutation,
    isPending: UpdateProjectIsPending,
    isError: UpdateProjectIsError,
    error: UpdateProjectError,
  } = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<UpdateProjectDto>;
    }) => updateProject(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["projects", params] });
      queryClient.invalidateQueries({ queryKey: ["projects", id] });
    },
  });

  const {
    mutate: DeleteProjectMutation,
    isPending: DeleteProjectIsPending,
    isError: DeleteProjectIsError,
    error: DeleteProjectError,
  } = useMutation({
    mutationFn: (id: string | null) => deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", params] });
    },
  });
  const {
    data: singleProjectData,
    isPending: SingleProjectIsPending,
    isError: SingleProjectIsError,
    isLoading: SingleProjectIsLoading,
  } = useQuery({
    queryKey: ["singleProject", params?.id],
    queryFn: () => getSingleProject(params?.id as string),
    enabled: !!params?.id,
  });
  return {
    projects: data?.data ?? [],
    pagination: data
      ? {
          totalPages: data.totalPages,
          currentPage: data.page,
          limit: data.limit,
          results: data.results,
        }
      : undefined,
    isLoading,
    isError,
    error,
    refetch,
    // Create
    CreateProjectMutation,
    CreateProjectIsPending,
    CreateProjectIsError,
    CreateProjectError,
    // Update
    UpdateProjectMutation,
    UpdateProjectIsPending,
    UpdateProjectIsError,
    UpdateProjectError,
    // Delete
    DeleteProjectMutation,
    DeleteProjectIsPending,
    DeleteProjectIsError,
    DeleteProjectError,
    // Single Project
    singleProjectData,
    SingleProjectIsPending,
    SingleProjectIsError,
    SingleProjectIsLoading,
  };
}
