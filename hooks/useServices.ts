import {
  createService,
  deleteService,
  editService,
  getServices,
} from "@/services/api/services";
import { ServicesQueryParams } from "@/types/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
export default function useServices(params?: ServicesQueryParams) {
  const queryCLient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["services", params],
    queryFn: () => getServices(params),
    placeholderData: (data) => {
      return data;
    },
  });
  const {
    mutate: CreateServiceMutation,
    isPending: CreateServiceIsPending,
    isError: CreateServiceIsError,
    error: CreateServiceError,
  } = useMutation({
    mutationFn: createService,
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["services", params] });
    },
  });
  const {
    mutate: EditServiceMutation,
    isError: EditServiceIsError,
    isPending: EditServiceIsPending,
    error: EditServiceError,
  } = useMutation({
    mutationFn: editService,
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["services", params] });
    },
  });
  const {
    mutate: DeleteServiceMutation,
    isPending: DeleteServiceIsPending,
    isError: DeleteServiceIsError,
    error: DeleteServiceError,
  } = useMutation({
    mutationFn: deleteService,
    onSuccess: () => {
      queryCLient.invalidateQueries({ queryKey: ["services", params] });
    },
  });
  return {
    services: data?.data,
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
    CreateServiceIsPending,
    CreateServiceMutation,
    CreateServiceIsError,
    CreateServiceError,
    EditServiceMutation,
    EditServiceError,
    EditServiceIsPending,
    EditServiceIsError,
    DeleteServiceMutation,
    DeleteServiceIsPending,
    DeleteServiceIsError,
    DeleteServiceError,
  };
}
