import axiosInstance from "@/lib/axios";
import {
  TransactionsQueryParams,
  TransactionsResponse,
  Transaction,
} from "@/types/transactions";

export const getTransactions = async (
  params?: TransactionsQueryParams,
): Promise<TransactionsResponse> => {
  const response = await axiosInstance.get("/transactions", { params });
  return response.data;
};

export const updateTransaction = async (
  id: string,
  data: Partial<Transaction>,
): Promise<Transaction> => {
  const response = await axiosInstance.patch(`/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const response = await axiosInstance.delete(`/transactions/${id}`);
  return response.data;
};
