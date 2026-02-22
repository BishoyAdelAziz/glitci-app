import TransactionsView from "@/components/features/transactions/TransactionsView";
import { TransactionType } from "@/types/transactions";

export function generateStaticParams() {
  return [{ type: "income" }, { type: "expense" }];
}

interface Props {
  params: Promise<{ type: string }>;
}

export default async function TransactionsPage({ params }: Props) {
  const { type } = await params;
  return <TransactionsView type={type as TransactionType} />;
}
