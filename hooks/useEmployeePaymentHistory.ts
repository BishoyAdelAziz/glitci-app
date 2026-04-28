"use client";

import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services/api/transactions";
import { ParamValue } from "next/dist/server/request/params";

export type EmployeePaymentTransaction = {
  id: string;
  amount: number;
  currency: string;
  date: string;
  type: string;
  employeeName: string;
  employeePosition: string;
  employeeEmail: string;
  status: string;
  paymentMethod: string;
  description: string;
  projectName: string;
};

export function useEmployeePaymentHistory(employeeId: string | ParamValue) {
  const query = useQuery({
    queryKey: ["employeePaymentHistory", employeeId],
    queryFn: async () => {
      const res = await getTransactions({
        employee: employeeId,
        type: "expense",
      });
      return res;
    },
    enabled: !!employeeId,
  });

  const transactions: EmployeePaymentTransaction[] =
    query.data?.data?.map((tx) => ({
      id: tx._id,
      amount: tx.amount,
      currency: tx.currency,
      date: tx.date,
      type: (tx.category || tx.type).replace(/_/g, " "),
      status: tx.status,
      paymentMethod: tx.paymentMethod,
      description:
        tx.description || `Payment to ${tx.employee?.user?.name || "employee"}`,
      employeeName: tx.employee?.user?.name || "",
      employeePosition: tx.employee?.position || "",
      employeeEmail: tx.employee?.user?.email || "",
      projectName: tx.project?.name || "",
      PaymentMethod: tx.paymentMethod,
    })) || [];

  return {
    transactions,
    isLoading: query.isLoading,
    isError: query.isError,
    errors: query.error ? [query.error] : null,
  };
}
