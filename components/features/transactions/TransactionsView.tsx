"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useTransactions from "@/hooks/useTransactions";
import TransactionsTable from "./TansactionsTable";
import {
  TransactionType,
  TransactionCategory,
  CATEGORIES_BY_TYPE,
} from "@/types/transactions";

interface Props {
  type: TransactionType;
}

const TYPE_TABS: { label: string; value: TransactionType }[] = [
  { label: "Income", value: "income" },
  { label: "Expenses", value: "expense" },
];

export default function TransactionsView({ type }: Props) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<TransactionCategory>();

  const [page, setPage] = useState(1);

  const categories = CATEGORIES_BY_TYPE[type];

  const {
    transactions,
    pagination,
    isLoading,
    isError,
    deleteTransactionMutation,
    deleteTransactionIsPending,
  } = useTransactions({
    type,
    category: activeCategory,
    page,
    limit: 10,
  });

  // Reset category when switching type tabs
  const handleTypeSwitch = (newType: TransactionType) => {
    setActiveCategory(undefined);
    setPage(1);
    router.push(`/transactions/${newType}`);
  };

  const handleCategorySwitch = (cat: TransactionCategory | undefined) => {
    setActiveCategory(cat);
    setPage(1);
  };

  return (
    <div className="space-y-4 p-6">
      {/* Type Tabs — Income / Expense */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
        {TYPE_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => handleTypeSwitch(tab.value)}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
              type === tab.value
                ? "bg-linear-to-r from-[#DE4646] to-[#B72D2D]  transition-all  ease-in-out duration-700 font-noor-bold text-white hover:bg-linear-to-l hover:from-[#B72D2D] hover:to-[#DE4646]"
                : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Category Tabs — nested under each type */}
      <div className="flex gap-2 flex-wrap border-b border-gray-200 dark:border-gray-700 pb-1">
        <button
          onClick={() => handleCategorySwitch(undefined)}
          className={`px-4 py-1.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
            !activeCategory
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategorySwitch(cat.value)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeCategory === cat.value
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <TransactionsTable
        transactions={transactions}
        isLoading={isLoading}
        isError={isError}
        pagination={pagination}
        onPageChange={setPage}
        onDelete={deleteTransactionMutation}
        isDeleting={deleteTransactionIsPending}
      />
    </div>
  );
}
