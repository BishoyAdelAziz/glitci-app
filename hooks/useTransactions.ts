"use client";

import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  createSalaryTansaction,
  createClientPaymentTransaction,
  ClientPaymentHistory,
} from "@/services/api/transactions";
import { TransactionsQueryParams, Transaction } from "@/types/transactions";
import { normalizeFinance } from "@/utils/functions";
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
      queryClient.invalidateQueries({ queryKey: ["transactions", params] });
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
      queryClient.invalidateQueries({ queryKey: ["transactions", params] });
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
      queryClient.invalidateQueries({ queryKey: ["transactions",params] });
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
  const {
    data: ClientPaymentHistoryData,
    isError: ClientPaymentHistoryIsError,
    isPending: ClientPaymentHistoryIsPending,
    error: ClientPaymentHistoryError,
  } = useQuery({
    queryKey: ["clientPaymentHistory", params?.projectId],
    queryFn: () => ClientPaymentHistory(params?.projectId as string),
    enabled: !!params?.projectId,
  });
  const query = useQuery({
    queryKey: ["clientPaymentHistory", params?.projectId],
    queryFn: () => ClientPaymentHistory(params?.projectId as string),
    enabled: !!params?.projectId,

    select: (res) => {
      // 🔥 normalize here
      return normalizeFinance(res?.data);
    },
  });

  return {
    finance: query.data,

    FinanceisLoading: query.isPending,
    FinanceisError: query.isError,
    Financeerror: query.error,
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
    // Client Payment History
    ClientPaymentHistoryData,
    ClientPaymentHistoryIsError,
    ClientPaymentHistoryIsPending,
    ClientPaymentHistoryError,
  };
}
