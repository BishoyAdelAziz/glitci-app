"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import type { ProjectFilters, Project } from "@/types/projects";
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "@/services/api/pfojects";

// Query keys factory
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  list: (filters: ProjectFilters) => [...projectKeys.lists(), filters] as const,
  details: () => [...projectKeys.all, "detail"] as const,
  detail: (id: string) => [...projectKeys.details(), id] as const,
};

// ==================== Main Hook ====================
export function useProjects() {
  const queryClient = useQueryClient();

  // Filter form using react-hook-form
  const filterForm = useForm<ProjectFilters>({
    defaultValues: {
      page: 1,
      limit: 10,
      status: undefined,
      priority: undefined,
      client: undefined,
      department: undefined,
      isActive: undefined,
    },
  });

  const filters = filterForm.watch();

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
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create project mutation
  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });

  // Update project mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Project> }) =>
      updateProject(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: projectKeys.detail(variables.id),
      });
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
    },
  });

  // Helper functions
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
    meta: projectsData?.meta,

    // Loading states
    isLoading,
    isError,
    error,

    // Filter form
    filterForm,
    filters,
    setPage,
    setLimit,
    resetFilters,

    // Mutations
    createProject: createMutation.mutate,
    updateProject: updateMutation.mutate,
    deleteProject: deleteMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Utils
    refetch,
  };
}
