import TransactionsView from "@/components/features/transactions/TransactionsView";
import { TransactionType } from "@/types/transactions";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ type: string }>;
}

export function generateStaticParams() {
  return [{ type: "income" }, { type: "expense" }];
}

export default async function TransactionsTypePage({ params }: Props) {
  const { type } = await params;

  if (type !== "income" && type !== "expense") {
    redirect("/transactions/income");
  }

  return <TransactionsView type={type as TransactionType} />;
}
