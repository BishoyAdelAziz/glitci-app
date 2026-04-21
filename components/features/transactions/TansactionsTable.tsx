"use client";

import { Transaction } from "@/types/transactions";
import { formatDate } from "@/utils/functions";
import ActionsMenu, { TrashIcon, EditIcon } from "@/components/ui/ActionsMenu";
import Pagination from "@/components/ui/Pagination";
import { PDFDownloadLink } from "@react-pdf/renderer";
import TransactionPDF from "./TransactionPDF";

interface Props {
  transactions?: Transaction[];
  isLoading: boolean;
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

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "My Company";

export default function TransactionsTable({
  transactions,
  isLoading,
  isError,
  pagination,
  onPageChange,
  onDelete,
  onEdit,
}: Props) {
  if (isLoading)
    return <div className="p-8 text-center animate-pulse">Loading...</div>;
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">Error loading data.</div>
    );
  if (!transactions?.length)
    return (
      <div className="p-8 text-center text-gray-500">
        No transactions found.
      </div>
    );

  return (
    <>
      <div className="space-y-4">
        <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          {/* --- DESKTOP TABLE VIEW --- */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr className="text-left text-sm font-semibold text-gray-700 dark:text-gray-300">
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Client/Employee</th>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Method</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4 text-center">Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {transactions.map((t) => (
                  <tr
                    key={t._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                      {t.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {t.client?.name || t.employee?.user?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                      {t.project?.name || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                      {t.category ? t.category.replace(/_/g, " ") : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 capitalize">
                      {t.paymentMethod?.replace(/_/g, " ") || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-gray-100">
                      {(t.amount ?? 0).toLocaleString()} {t.currency || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-center text-gray-500">
                      {t.date ? formatDate(t.date) : "-"}
                    </td>
                    <td className="px-6 text-center py-4">
                      {t.status ? (
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${STATUS_COLORS[t.status] || "bg-gray-100 text-gray-700"}`}
                        >
                          {t.status}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 text-center relative">
                      <div className="hidden">
                        <PDFDownloadLink
                          id={`pdf-${t._id}`}
                          document={
                            <TransactionPDF
                              transaction={t}
                              appName={APP_NAME}
                            />
                          }
                          fileName={`${t.category || "transaction"}-receipt.pdf`}
                        >
                          Download
                        </PDFDownloadLink>
                      </div>
                      <ActionsMenu
                        actions={[
                          {
                            label: "Edit",
                            icon: <EditIcon />,
                            onClick: () => onEdit(t),
                          },
                          {
                            label: "Print",
                            icon: <EditIcon />,
                            onClick: () =>
                              document.getElementById(`pdf-${t._id}`)?.click(),
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

          {/* --- MOBILE CARD VIEW --- */}
          <div className="lg:hidden flex flex-col gap-4 p-4 bg-gray-50 dark:bg-gray-950">
            {transactions.map((t) => (
              <div
                key={t._id}
                className="p-4 space-y-3 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {t.description || "-"}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {t.date ? formatDate(t.date) : "-"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="hidden">
                      <PDFDownloadLink
                        id={`pdf-mob-${t._id}`}
                        document={
                          <TransactionPDF transaction={t} appName={APP_NAME} />
                        }
                        fileName={`${t.category || "transaction"}-receipt.pdf`}
                      >
                        Download
                      </PDFDownloadLink>
                    </div>
                    <ActionsMenu
                      actions={[
                        {
                          label: "Edit",
                          icon: <EditIcon />,
                          onClick: () => onEdit(t),
                        },
                        {
                          label: "Print",
                          icon: <EditIcon />,
                          onClick: () =>
                            document
                              .getElementById(`pdf-mob-${t._id}`)
                              ?.click(),
                        },
                        {
                          label: "Delete",
                          icon: <TrashIcon />,
                          onClick: () => onDelete(t._id),
                          variant: "danger",
                        },
                      ]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-amber-100/50 dark:border-gray-800 pt-3">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Client/Employee
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {t.client?.name || t.employee?.user?.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Project
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {t.project?.name || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Category
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {t.category ? t.category.replace(/_/g, " ") : "-"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Amount
                    </p>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {(t.amount ?? 0).toLocaleString()} {t.currency || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-amber-100/50 dark:border-gray-800 mt-2">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      Method
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {t.paymentMethod?.replace(/_/g, " ") || "-"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-widest ${
                      t.status
                        ? STATUS_COLORS[t.status] || "bg-gray-100 text-gray-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {t.status || "-"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {pagination && (
        <div className="w-full flex mt-[5vh] items-center justify-center">
          <Pagination
            total={pagination.totalPages}
            limit={pagination.limit}
            currentPage={pagination.currentPage}
            onChange={onPageChange}
          />
        </div>
      )}
    </>
  );
}
