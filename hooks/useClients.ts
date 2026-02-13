import { AddClient, getClients } from "@/services/api/clients";
import { ClientsQueryParams } from "@/types/clients";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
export default function useClients(params?: ClientsQueryParams) {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["clients", params],
    queryFn: () => getClients(params),
  });
  const {
    mutate: AddClientMutation,
    isError: AddClientMutationIsError,
    error: AddClientMutationError,
    isPending: AddClientMutationIsPending,
  } = useMutation({
    mutationFn: AddClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients", params] });
    },
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
    AddClientMutation,
    AddClientMutationError,
    AddClientMutationIsError,
    AddClientMutationIsPending,
  };
}
