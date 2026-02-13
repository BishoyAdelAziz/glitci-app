"use client";
import PageHeader from "@/components/features/transactions/PageHeader";
import TransactionsTable from "@/components/features/transactions/TransActionsTable";
import { useState } from "react";
export default function TransactionsPage() {
  const [isCreateTransactionsOpen, setIsCreateTransactionOpen] =
    useState<boolean>(false);
  return (
    <div>
      <PageHeader
        isOpen={isCreateTransactionsOpen}
        setIsOpen={setIsCreateTransactionOpen}
      />
      <div className="mt-20">
        <TransactionsTable
          isOpen={isCreateTransactionsOpen}
          setIsOpen={setIsCreateTransactionOpen}
        />
      </div>
    </div>
  );
}
