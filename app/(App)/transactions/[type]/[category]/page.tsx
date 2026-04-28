import { redirect } from "next/navigation";
import TransactionsView from "@/components/features/transactions/TransactionsView";
import { findRoute, ROUTES_BY_TYPE } from "@/config/Transactionroutes";
import { TransactionType } from "@/types/transactions";

interface Props {
  params: Promise<{ type: string; category: string }>;
}

// Statically generate all valid type/category combos
export function generateStaticParams() {
  return [
    // Income
    { type: "income", category: "client_payment" },
    { type: "income", category: "other_income" },
    // Expense
    { type: "expense", category: "employee_salary" },
    { type: "expense", category: "employee_payment" },
    { type: "expense", category: "employee_bonus" },
    { type: "expense", category: "equipment" },
    { type: "expense", category: "software" },
    { type: "expense", category: "marketing" },
    { type: "expense", category: "office" },
    { type: "expense", category: "utilities" },
    { type: "expense", category: "other_expense" },
  ];
}

export default async function TransactionsCategoryPage({ params }: Props) {
  const { type, category } = await params;

  // Guard: if the type/category combo is invalid, redirect to default
  const route = findRoute(type, category);
  if (!route) {
    const fallbackCategory =
      ROUTES_BY_TYPE["income"]?.[0]?.slug ?? "client_payment";
    redirect(`/transactions/income/${fallbackCategory}`);
  }

  return <TransactionsView type={type as TransactionType} />;
}
