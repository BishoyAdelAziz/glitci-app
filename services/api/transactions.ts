import axiosInstance from "@/lib/axios";
import {
  TransactionsQueryParams,
  TransactionsResponse,
  SingleTransactionResponse,
  Transaction,
} from "@/types/transactions";
import { ParamValue } from "next/dist/server/request/params";

export async function getTransactions(
  params?: TransactionsQueryParams,
): Promise<TransactionsResponse> {
  const { data } = await axiosInstance.get("/transactions", { params });
  return data;
}

export async function getTransactionById(
  id: string,
): Promise<SingleTransactionResponse> {
  const { data } = await axiosInstance.get(`/transactions/${id}`);
  return data;
}

export async function createTransaction(
  payload: Record<string, unknown>,
): Promise<SingleTransactionResponse> {
  const { data } = await axiosInstance.post("/transactions/expense", payload);
  return data;
}
export async function createClientPaymentTransaction(
  payload: Record<string, unknown>,
): Promise<SingleTransactionResponse> {
  const response = await axiosInstance.post(
    "/transactions/client-payment",
    payload,
  );
  return response.data;
}

export async function createSalaryTansaction(
  payload: Record<string, unknown>,
): Promise<SingleTransactionResponse> {
  const response = await axiosInstance.post(
    "/transactions/employee-payment",
    payload,
  );
  return response.data;
}

export async function updateTransaction(
  id: string,
  payload: Partial<Transaction>,
): Promise<SingleTransactionResponse> {
  const { data } = await axiosInstance.patch(`/transactions/${id}`, payload);
  return data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await axiosInstance.delete(`/transactions/${id}`);
}
export const ClientPaymentHistory = async (projectId: string | ParamValue) => {
  const response = await axiosInstance.get(
    `/finance/project/${projectId}/payments/client`,
  );
  return response.data;
};
export const EmployeePaymentHistory = async (
  projectId: string | ParamValue,
) => {
  const response = await axiosInstance(
    `/finance/project/${projectId}/payments/employees`,
  );
  return response.data;
};
