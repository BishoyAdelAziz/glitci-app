import { getServices } from "@/services/api/services";
import { ServicesQueryParams } from "@/types/services";
import { useQuery } from "@tanstack/react-query";

export default function useServices(params?: ServicesQueryParams) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["services", params],
    queryFn: () => getServices(params),
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
  };
}
