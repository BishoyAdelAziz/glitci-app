"use client";

import { Transaction } from "@/types/transactions";
import { formatDate } from "@/utils/functions";
import ActionsMenu, {
  TrashIcon,
  EyeIcon,
  EditIcon,
} from "@/components/ui/ActionsMenu";
import Pagination from "@/components/ui/Pagination";

interface Props {
  transactions?: Transaction[];
  isLoading: boolean;
  category?: string;

  isError: boolean;
  pagination?: {
    totalPages: number;
    currentPage: number;
    limit: number;
    results: number;
  };
  onPageChange: (page: number) => void;
  onDelete: (id: string) => void;
  onEdit: (transaction: Transaction) => void;
}

const STATUS_COLORS: Record<string, string> = {
  completed:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const METHOD_LABELS: Record<string, string> = {
  instapay: "InstaPay",
  card: "Card",
  cash: "Cash",
  bank_transfer: "Bank Transfer",
};

export default function TransactionsTable({
  transactions,
  isLoading,
  isError,
  pagination,
  onPageChange,
  onDelete,
  category,
  onEdit,
}: Props) {
  if (isLoading) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 text-center text-red-600 dark:text-red-400">
        Error loading transactions. Please try again.
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-gray-900 rounded-2xl shadow-sm p-8 text-center text-gray-500 dark:text-gray-400">
        No transactions found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm ring-[0.02rem] ring-gray-300 dark:ring-gray-700">
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr className="text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Project</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-center">Date</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Added By</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((t) => (
                <tr
                  key={t._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 max-w-50 ">
                    {t.description}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {t?.project?.name || "-"}{" "}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 capitalize">
                    {t.category.replace(/_/g, " ")}
                  </td>

                  <td className="px-6 py-4 text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {t.amount.toLocaleString()} {t.currency}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {METHOD_LABELS[t.paymentMethod] ?? t.paymentMethod}
                  </td>
                  <td className="px-6 py-4 text-sm text-center text-gray-600 dark:text-gray-400">
                    {formatDate(t.date)}
                  </td>
                  <td className="px-6 text-center py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${STATUS_COLORS[t.status]}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {t.addedBy.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <ActionsMenu
                      actions={[
                        {
                          label: "Edit",
                          icon: <EditIcon />,
                          onClick: () => onEdit(t),
                          variant: "default",
                        },
                        {
                          label: "Delete",
                          icon: <TrashIcon />,
                          onClick: () => onDelete(t._id),
                          variant: "danger",
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4 p-4">
          {transactions.map((t) => (
            <div
              key={t?._id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3  outline-1 outline-gray-200 dark:outline-gray-700"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                    {t?.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {t?.project?.name}
                  </p>
                </div>
                <ActionsMenu
                  actions={[
                    {
                      label: "Delete",
                      icon: <TrashIcon />,
                      onClick: () => onDelete(t._id),
                      variant: "danger",
                    },
                  ]}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    Amount
                  </span>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {t.amount.toLocaleString()} {t.currency}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    Date
                  </span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {formatDate(t.date)}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    Method
                  </span>
                  <p className="text-gray-900 dark:text-gray-100">
                    {METHOD_LABELS[t.paymentMethod] ?? t.paymentMethod}
                  </p>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                    Category
                  </span>
                  <p className="text-gray-900 dark:text-gray-100 capitalize">
                    {t.category.replace(/_/g, " ")}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${STATUS_COLORS[t.status]}`}
                >
                  {t.status}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  By {t.addedBy.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <Pagination
          total={pagination.results} // ← total items count, not total pages
          limit={pagination.limit}
          currentPage={pagination.currentPage}
          onChange={onPageChange}
        />
      )}
    </div>
  );
}
