"use client";

import { useRouter } from "next/navigation";
import { useState, Fragment } from "react";
import { Menu, MenuButton, Transition } from "@headlessui/react";
import useTransactions from "@/hooks/useTransactions";
import TransactionsTable from "./TansactionsTable";
import AddClientPaymentModal from "./AddClientPayment";
import AddEmployeePaymentModal from "./Addemployeepaymentmodal";
import AddGeneralExpenseModal from "./Addgeneralexpensemodal";
import EditTransactionModal from "./EditTransactionModal";
import DeleteTransactionModal from "./DeleteTransactionModal";
import TransactionFilterModal from "./TransactionFilterModal";
import { useSearchParam } from "@/hooks/useSearchParam";
import {
  ROUTES_BY_TYPE,
  CategoryRoute,
  findRoute,
} from "@/config/Transactionroutes";
import { TransactionType, Transaction } from "@/types/transactions";
import type { GeneralExpenseFormData } from "@/services/validations/transactions";

interface Props {
  type: TransactionType;
}

const TYPE_TABS: { label: string; value: TransactionType }[] = [
  { label: "Income", value: "income" },
  { label: "Expenses", value: "expense" },
];

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
  if (category === "client_payment" || category === "other_income")
    return "client_payment";
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

export default function TransactionsView({ type }: Props) {
  const search = useSearchParam();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(
    undefined,
  );
  const [addingCategory, setAddingCategory] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] =
    useState<Transaction | null>(null);

  const activeRoute: CategoryRoute | undefined = categoryFilter
    ? findRoute(type, categoryFilter)
    : undefined;

  // Determine what category we are adding
  const currentAddCategory = addingCategory || categoryFilter;
  const addActiveRoute = currentAddCategory
    ? findRoute(type, currentAddCategory)
    : undefined;
  const modalType = currentAddCategory
    ? getModalType(currentAddCategory)
    : null;

  const { transactions, pagination, isLoading, isError } = useTransactions({
    type,
    category: activeRoute?.category,
    page,
    limit: 10,
    name: search,
  });

  const handleTypeSwitch = (newType: TransactionType) => {
    setPage(1);
    setCategoryFilter(undefined);
    router.push(`/transactions/${newType}`);
  };

  const handleEdit = (transaction: Transaction) =>
    setEditingTransaction(transaction);

  const handleOpenAddModal = (slug?: string) => {
    if (slug) {
      setAddingCategory(slug);
    }
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setTimeout(() => setAddingCategory(null), 300);
  };

  return (
    <div className="space-y-4 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h3 className="capitalize font-bold text-2xl">Transactions</h3>

          <button
            onClick={() => setIsFilterOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all border ${
              categoryFilter
                ? "border-[#DE4646] bg-[#DE4646]/10 text-[#DE4646]"
                : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <span className="font-medium">
              Filter: {activeRoute ? activeRoute.label : "All"}
            </span>
          </button>
        </div>

        <div className="flex items-center  justify-center gap-3">
          {/* Add button */}
          {categoryFilter ? (
            <button
              onClick={() => handleOpenAddModal()}
              className="px-5 py-2 rounded-lg text-xs h-full text-nowrap font-medium bg-linear-to-r from-[#DE4646] to-[#B72D2D] text-white hover:from-[#B72D2D] hover:to-[#DE4646] transition-all duration-300 shadow-md shadow-[#DE4646]/20"
            >
              + Add {activeRoute?.label ?? "Transaction"}
            </button>
          ) : (
            <Menu as="div" className="relative h-full text-left">
              <MenuButton className="px-5 py-2 rounded-lg text-xs h-full text-nowrap font-medium bg-linear-to-r from-[#DE4646] to-[#B72D2D] text-white hover:from-[#B72D2D] hover:to-[#DE4646] transition-all duration-300 shadow-md shadow-[#DE4646]/20">
                + Add Transaction
              </MenuButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                  <div className="px-1 py-1">
                    {ROUTES_BY_TYPE[type].map((cat) => (
                      <Menu.Item key={cat.slug}>
                        {({ active }) => (
                          <button
                            onClick={() => handleOpenAddModal(cat.slug)}
                            className={`${
                              active
                                ? "bg-[#DE4646] text-white"
                                : "text-gray-900 dark:text-gray-200"
                            } group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}
                          >
                            + Add {cat.label}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          )}

          {/* Income / Expense type tabs */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl w-fit">
            {TYPE_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTypeSwitch(tab.value)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  type === tab.value
                    ? "bg-linear-to-r from-[#DE4646] to-[#B72D2D] text-white font-bold shadow"
                    : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl    overflow-hidden mt-4">
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
      </div>

      <TransactionFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        type={type}
        currentCategory={categoryFilter}
        onApply={(cat) => {
          setPage(1);
          setCategoryFilter(cat);
        }}
      />

      {/* Modals */}
      {modalType === "client_payment" && (
        <AddClientPaymentModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
        />
      )}

      {modalType === "employee_payment" && (
        <AddEmployeePaymentModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          defaultTab={
            (currentAddCategory as
              | "employee_salary"
              | "employee_bonus"
              | "employee_payment") || undefined
          }
        />
      )}

      {modalType === "general_expense" && (
        <AddGeneralExpenseModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          defaultCategory={
            currentAddCategory as GeneralExpenseFormData["category"]
          }
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
