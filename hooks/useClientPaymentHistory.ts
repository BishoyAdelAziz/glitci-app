"use client";

import { useQueries } from "@tanstack/react-query";
import { ClientPaymentHistory } from "@/services/api/transactions";

type Payment = {
  id: string;
  amount: number;
  currency: string;
  date: string;
  type: string;
};

type PaymentGroup = {
  project: {
    id: string;
    name: string;
    budget: number;
    currency: string;
    client: {
      id: string;
      name: string;
      companyName: string;
    };
  };
  payments: Payment[];
  summary: {
    totalPayments: number;
    totalCollected: number;
    balanceDue: number;
    percentagePaid: number;
    currency: string;
  };
};

export type Transaction = {
  id: string;
  amount: number;
  currency: string;
  date: string;
  type: string;
  projectName: string;
  clientName: string;
  status: string;
  paymentMethod: string;
  description: string;
};

export function useClientPaymentsHistory(projectIds: string[]) {
  const queries = useQueries({
    queries: projectIds.map((id) => ({
      queryKey: ["clientPaymentHistory", id],
      queryFn: async () => {
        const res = await ClientPaymentHistory(id);
        return res.data;
      },
      enabled: !!id,
    })),
  });

  const transactions: Transaction[] = queries
    .filter((q) => q.data)
    .flatMap((q) => {
      const data = q.data;

      return data.payments.map((p: any) => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        date: p.date,
        description: p.description,
        paymentMethod: p.paymentMethod,
        status: p.status,
        addedBy: p.addedBy,

        projectName: data.project.name,
        clientName: data.project.client.name,
      }));
    });

  return {
    transactions,
    isLoading: queries.some((q) => q.isLoading),
  };
}
