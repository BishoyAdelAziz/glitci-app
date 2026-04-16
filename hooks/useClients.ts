import {
  AddClient,
  deleteClient,
  editClient,
  getClients,
  getSingleClient,
} from "@/services/api/clients";
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

  const {
    mutate: updateClientMutation,
    isPending: updateClientIsPending,
    error: updateClientError,
    isError: UpdateClientIsError,
  } = useMutation({
    mutationFn: ({ clientId, data }: { clientId: string; data: any }) =>
      editClient({ data, clientId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["Client", params?.clientId] });
    },
  });

  const {
    data: singleClient,
    isPending: SingleClientIsPending,
    isError: SingleCLientIsError,
    error: singleClientError,
  } = useQuery({
    queryKey: ["Client", params?.clientId],
    queryFn: () => getSingleClient(params?.clientId),
    enabled: !!params?.clientId,
  });
  const {
    mutate: DeleteClientMutation,
    isPending: DeleteClientIsPending,
    isError: DeleteClientisError,
    error: DeleteClientError,
  } = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      queryClient.invalidateQueries({ queryKey: ["Client", params?.clientId] });
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
    singleClient,
    SingleClientIsPending,
    SingleCLientIsError,
    singleClientError,
    updateClientMutation,
    updateClientIsPending,
    updateClientError,
    UpdateClientIsError,
    DeleteClientMutation,
    DeleteClientIsPending,
    DeleteClientisError,
    DeleteClientError,
  };
}
