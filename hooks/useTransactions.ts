import {
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "@/services/api/transactions";
import { TransactionsQueryParams, Transaction } from "@/types/transactions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useTransactions(params?: TransactionsQueryParams) {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["transactions", params],
    queryFn: () => getTransactions(params),
  });

  const {
    mutate: updateTransactionMutation,
    isPending: updateTransactionIsPending,
    isError: updateTransactionIsError,
    error: updateTransactionError,
  } = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) =>
      updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", params] });
    },
  });

  const {
    mutate: deleteTransactionMutation,
    isPending: deleteTransactionIsPending,
    isError: deleteTransactionIsError,
    error: deleteTransactionError,
  } = useMutation({
    mutationFn: deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions", params] });
    },
  });

  return {
    transactions: data?.data,
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
    updateTransactionMutation,
    updateTransactionIsPending,
    updateTransactionIsError,
    updateTransactionError,
    deleteTransactionMutation,
    deleteTransactionIsPending,
    deleteTransactionIsError,
    deleteTransactionError,
  };
}
