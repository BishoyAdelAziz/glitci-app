import { redirect } from "next/navigation";
import { ROUTES_BY_TYPE } from "@/config/Transactionroutes";
import { TransactionType } from "@/types/transactions";

interface Props {
  params: Promise<{ type: string }>;
}

export function generateStaticParams() {
  return [{ type: "income" }, { type: "expense" }];
}

export default async function TransactionsTypePage({ params }: Props) {
  const { type } = await params;
  const validType = type as TransactionType;
  const routes = ROUTES_BY_TYPE[validType];

  if (!routes?.length) {
    redirect("/transactions/income/client_payment");
  }

  redirect(`/transactions/${type}/${routes[0].slug}`);
}
