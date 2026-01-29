import { getEmployees } from "@/services/api/employees";
import { EmployeesQueryParams } from "@/types/employees";
import { useQuery } from "@tanstack/react-query";

export default function useEmployees(params?: EmployeesQueryParams) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["employees", params],
    queryFn: () => getEmployees(params),
  });

  return {
    employees: data?.data,
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
