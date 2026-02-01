import { getClients } from "@/services/api/clients";
import { ClientsQueryParams } from "@/types/clients";
import { useQuery } from "@tanstack/react-query";

export default function useClients(params?: ClientsQueryParams) {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["clients", params],
    queryFn: () => getClients(params),
  });

  return {
    clients: data?.data,
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
