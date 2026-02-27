import { redirect } from "next/navigation";

export default function TransactionsIndexPage() {
  redirect("/transactions/income/client_payment");
}
