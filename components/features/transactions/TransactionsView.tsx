"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import useTransactions from "@/hooks/useTransactions";
import TransactionsTable from "./TansactionsTable";
import AddClientPaymentModal from "./AddClientPayment";
import AddEmployeePaymentModal from "./Addemployeepaymentmodal";
import AddGeneralExpenseModal from "./Addgeneralexpensemodal";
import EditTransactionModal from "./EditTransactionModal";
import DeleteTransactionModal from "./DeleteTransactionModal";

import {
  ROUTES_BY_TYPE,
  CategoryRoute,
  findRoute,
} from "@/config/Transactionroutes";
import { TransactionType, Transaction } from "@/types/transactions";
import type { GeneralExpenseFormData } from "@/services/validations/transactions";

interface Props {
  type: TransactionType;
  category: string; // raw slug from URL
}

const TYPE_TABS: { label: string; value: TransactionType }[] = [
  { label: "Income", value: "income" },
  { label: "Expenses", value: "expense" },
];

// Which modal to show per category slug
type ModalType =
  | "client_payment"
  | "employee_payment"
  | "general_expense"
  | null;

const GENERAL_EXPENSE_SLUGS: GeneralExpenseFormData["category"][] = [
  "equipment",
  "software",
  "marketing",
  "office",
  "utilities",
  "other_expense",
];

function getModalType(category: string): ModalType {
  if (category === "client_payment") return "client_payment";
  if (
    category === "employee_salary" ||
    category === "employee_bonus" ||
    category === "employee_payment"
  )
    return "employee_payment";
  if (
    GENERAL_EXPENSE_SLUGS.includes(
      category as GeneralExpenseFormData["category"],
    )
  )
    return "general_expense";
  return null;
}

export default function TransactionsView({ type, category }: Props) {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  const activeRoute: CategoryRoute | undefined = findRoute(type, category);
  const categoryRoutes = ROUTES_BY_TYPE[type];
  const modalType = getModalType(category);

  const {
    transactions,
    pagination,
    isLoading,
    isError,
    deleteTransactionMutation,
    deleteTransactionIsPending,
  } = useTransactions({
    type,
    category: activeRoute?.category,
    page,
    limit: 10,
  });

  const handleTypeSwitch = (newType: TransactionType) => {
    const firstCategory = ROUTES_BY_TYPE[newType][0].slug;
    setPage(1);
    router.push(`/transactions/${newType}/${firstCategory}`);
  };

  const handleCategorySwitch = (slug: string) => {
    setPage(1);
    router.push(`/transactions/${type}/${slug}`);
  };
  const handleEdit = (transaction: Transaction) =>
    setEditingTransaction(transaction);

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row  items-start md:items-center justify-between">
        <h3 className="capitalize font-bold text-2xl">Transactions</h3>

        <div className="flex items-stretch gap-3">
          {/* Add button */}
          {modalType && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-2 rounded-lg text-xs text-nowrap font-medium bg-linear-to-r from-[#DE4646] to-[#B72D2D] text-white hover:from-[#B72D2D] hover:to-[#DE4646] transition-all duration-300"
            >
              + Add {activeRoute?.label ?? "Transaction"}
            </button>
          )}

          {/* Income / Expense type tabs */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTypeSwitch(tab.value)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  type === tab.value
                    ? "bg-linear-to-r from-[#DE4646] to-[#B72D2D] text-white font-bold"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category tabs — route-based */}
      <div className="flex gap-2 flex-wrap border-b border-gray-200 dark:border-gray-700 p-2">
        {categoryRoutes.map((route) => (
          <button
            key={route.slug}
            onClick={() => handleCategorySwitch(route.slug)}
            className={`px-4 py-1.5 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${
              category === route.slug
                ? "border-[#DE4646] text-[#DE4646]"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {route.label}
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
        onDelete={(id) => {
          const t = transactions?.find((t) => t._id === id);
          if (t) setDeletingTransaction(t);
        }}
        onEdit={handleEdit}
      />

      {/* Modals */}
      {modalType === "client_payment" && (
        <AddClientPaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {modalType === "employee_payment" && (
        <AddEmployeePaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          defaultTab={
            category as
              | "employee_salary"
              | "employee_bonus"
              | "employee_payment"
          }
        />
      )}

      {modalType === "general_expense" && (
        <AddGeneralExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          defaultCategory={category as GeneralExpenseFormData["category"]}
        />
      )}
      <EditTransactionModal
        transaction={editingTransaction}
        onClose={() => setEditingTransaction(null)}
      />
      <DeleteTransactionModal
        transaction={deletingTransaction}
        onClose={() => setDeletingTransaction(null)}
      />
    </div>
  );
}
