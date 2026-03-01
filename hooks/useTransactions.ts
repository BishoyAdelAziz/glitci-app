"use client";

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  createSalaryTansaction,
  createClientPaymentTransaction,
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
    mutate: createTransactionMutation,
    isPending: createTransactionIsPending,
    isError: createTransactionIsError,
    error: createTransactionError,
  } = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      createTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
  const {
    mutate: createClientPaymentTransactionMutation,
    isPending: createClientPaymentTransactionIsPending,
    isError: createClientPaymentTransactionIsError,
    error: createClientPaymentTransactionError,
  } = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      createClientPaymentTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
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
  const {
    mutate: SalaryMutaiton,
    isPending: SalaryMutaitonIsPending,
    isError: SalaryMutaitonIsError,
    error: SalaryMutaitonError,
  } = useMutation({
    mutationFn: createSalaryTansaction,
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
    // Create
    createTransactionMutation,
    createTransactionIsPending,
    createTransactionIsError,
    createTransactionError,
    // Update
    updateTransactionMutation,
    updateTransactionIsPending,
    updateTransactionIsError,
    updateTransactionError,
    // Delete
    deleteTransactionMutation,
    deleteTransactionIsPending,
    deleteTransactionIsError,
    deleteTransactionError,
    // Salary
    SalaryMutaiton,
    SalaryMutaitonError,
    SalaryMutaitonIsError,
    SalaryMutaitonIsPending,
    // Client Payment
    createClientPaymentTransactionMutation,
    createClientPaymentTransactionError,
    createClientPaymentTransactionIsError,
    createClientPaymentTransactionIsPending,
  };
}
