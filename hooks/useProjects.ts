"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProjectFilters, UpdateProjectDto } from "@/types/projects";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProjectById,
} from "@/services/api/projects";
import { ProjectFormData, projectSchema } from "@/services/validations/project";

// Query keys factory
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

interface UseProjectsOptions {
  onSuccess?: () => void;
  id?: string | null; // For fetching single project
}

// ==================== Main Hook ====================
export function useProjects(options?: UseProjectsOptions) {
  const queryClient = useQueryClient();

  // Filter form using react-hook-form
  const filterForm = useForm<ProjectFilters>({
    defaultValues: {
      page: 1,
      limit: 10,
      client: undefined,
      status: undefined,
      isActive: undefined,
    },
  });

  const filters = filterForm.watch();
  const paginationParams = {
    page: filters.page,
    limit: filters.limit,
  };

  const filterParams = {
    client: filters.client,
    status: filters.status,
    isActive: filters.isActive,
  };
  // Fetch single project by ID
  const {
    data: singleProject,
    isLoading: singleProjectIsPending,
    isError: singleProjectIsError,
    error: singleProjectError,
    refetch: refetchSingleProject,
  } = useQuery({
    queryKey: projectKeys.detail(options?.id || ""),
    queryFn: () => getProjectById(options?.id as string),
    enabled: !!options?.id, // Only fetch if ID is provided
    staleTime: 5 * 60 * 1000,
  });

  // Fetch projects with filters
  const {
    data: projectsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: projectKeys.list(filters),
    queryFn: () => getProjects(filters),
    placeholderData: (prev) => {
      prev;
      return prev;
    },
  });
  const pagination = projectsData
    ? {
        totalPages: projectsData.totalPages,
        currentPage: projectsData.page,
        limit: projectsData.limit,
        total: projectsData.results, // or totalItems if available
      }
    : undefined;

  // Project form using react-hook-form with validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      reset(); // Reset form after successful creation
      options?.onSuccess?.(); // Trigger callback (e.g., close modal)
    },
  });

  // Update project mutation
  const {
    mutate: updateProjectMutation,
    isError: UpdateProjectIsError,
    isPending: updateProjectIsPending,
    error: updateProjectError,
  } = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<UpdateProjectDto>;
    }) => updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.id),
      });
      reset();
      options?.onSuccess?.();
    },
  });

  // Delete project mutation
  const {
    mutate: DeleteProjetMutation,
    isPending: DeleteProjectIsPending,
    error: DeleteProjectError,
    isError: deleteProjectIsError,
  } = useMutation({
    mutationFn: deleteProject,
    onSuccess: (data, variables) => {
      // ✅ Invalidate the deleted project's cache
      queryClient.invalidateQueries({
        queryKey: ["project", variables],
      });
      // ✅ Refetch the projects list
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });

  // Form submit handler
  const onSubmit: SubmitHandler<ProjectFormData> = (data) => {
    createMutation.mutate(data);
  };

  // Helper functions for pagination
  const setPage = (page: number) => {
    filterForm.setValue("page", page);
  };

  const setLimit = (limit: number) => {
    filterForm.setValue("limit", limit);
    filterForm.setValue("page", 1); // Reset to first page when changing limit
  };

  const resetFilters = () => {
    filterForm.reset();
  };

  return {
    // Data
    projects: projectsData?.data || [],
    pagination, // Clean pagination object for Pagination component
    filterParams, // { client, status, isActive } - for filter UI
    filterForm,
    resetFilters,
    // Single project data
    singleProject,
    singleProjectIsPending,
    singleProjectIsError,
    singleProjectError,
    refetchSingleProject,
    // update Project
    paginationParams, // { page, limit } - for Pagination component
    setPage,
    setLimit,
    updateProjectMutation,
    UpdateProjectIsError,
    updateProjectIsPending,
    updateProjectError,
    // Loading states
    isLoading,
    isError,
    error,

    // Filter management

    // Form handling
    register,
    handleSubmit,
    FormErrors: errors,
    onSubmit,
    control,
    setValue,
    watch,
    resetForm: reset,

    // Mutations
    createProject: createMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    // delete Project Mutations
    DeleteProjectError,
    DeleteProjectIsPending,
    DeleteProjetMutation,
    deleteProjectIsError,
    CreateError: createMutation.error,
    isCreateError: createMutation.isError,
    // Utils
    refetch,
  };
}
