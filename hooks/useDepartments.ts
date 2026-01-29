import { getDepartments } from "@/services/api/departments";
import { DepartmentsQueryParams } from "@/types/departments";
import { useQuery } from "@tanstack/react-query";

export default function useDepartments(params?: DepartmentsQueryParams) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["departments", params],
    queryFn: () => getDepartments(params),
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
  };
}
