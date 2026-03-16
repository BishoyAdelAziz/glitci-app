import {
  CreateDepartment,
  DeleteDepartment,
  getDepartments,
  UpdateDepartment,
} from "@/services/api/departments";
import { AddDepartmentFormFIelds } from "@/services/validations/departments";
import { DepartmentsQueryParams } from "@/types/departments";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useDepartments(params?: DepartmentsQueryParams) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["departments", params],
    queryFn: () => getDepartments(params),
  });
  const {
    mutate: CreateDepartmentMutation,
    isError: CreateDepartmentIsError,
    isPending: CreateDepartmentIsPending,
    error: CreateDepartmentError,
  } = useMutation({
    mutationFn: CreateDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments", params] });
    },
  });
  const {
    mutate: DeleteDepartmentMutation,
    isPending: DeleteDepartmentIsPending,
    isError: DeleteDepartmentIsError,
    error: DeleteDepartmentError,
  } = useMutation({
    mutationFn: DeleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments", params] });
    },
  });
  const {
    mutate: EditDepartmentMutation,
    isError: EditDepartmentIsError,
    isPending: EditDepartmentIsPending,
    error: EditDepartmentError,
  } = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string | undefined;
      data: AddDepartmentFormFIelds;
    }) => UpdateDepartment(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["departments", params] });
    },
  });
  return {
    departments: data?.data,
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
    CreateDepartmentMutation,
    CreateDepartmentIsError,
    CreateDepartmentIsPending,
    CreateDepartmentError,
    DeleteDepartmentMutation,
    DeleteDepartmentIsPending,
    DeleteDepartmentIsError,
    DeleteDepartmentError,
    EditDepartmentIsError,
    EditDepartmentMutation,
    EditDepartmentIsPending,
    EditDepartmentError,
  };
}
