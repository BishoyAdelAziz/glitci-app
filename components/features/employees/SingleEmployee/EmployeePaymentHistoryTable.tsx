"use client";

import { useEmployeePaymentHistory } from "@/hooks/useEmployeePaymentHistory";
import { ParamValue } from "next/dist/server/request/params";

interface Props {
  employeeId: string | ParamValue;
}

export default function EmployeePaymentHistoryTable({ employeeId }: Props) {
  // ✅ Hook is consumed inside the component
  const { transactions, isLoading } = useEmployeePaymentHistory(employeeId);

  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-500">
        Loading payment history...
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No payment transactions found
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div>
        <h3 className="font-bold text-gray-500 text-xl">Payment History</h3>
        <div className="bg-linear-to-r from-[#DE4646] h-1 w-22 mt-2 to-[#B72D2D]" />
      </div>

      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm ring-[0.02rem] ring-gray-300">
        {/* ================= Desktop ================= */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full grid">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                <th className="col-span-2 text-center">Employee</th>
                <th className="col-span-2 text-center">Position</th>
                <th className="col-span-2 text-center">Amount</th>
                <th className="col-span-2 text-center">Type</th>
                <th className="col-span-2 text-center">Date</th>
                <th className="col-span-2 text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {transactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 text-sm items-center border-gray-200 dark:border-gray-700 border-b"
                >
                  <td className="col-span-2 font-medium text-center">
                    <div>
                      <p className="font-semibold">{tx.employeeName}</p>
                      <p className="text-xs text-gray-500">
                        {tx.employeeEmail}
                      </p>
                    </div>
                  </td>

                  <td className="col-span-2 text-gray-600 text-center">
                    {tx.employeePosition}
                  </td>

                  <td className="col-span-2 font-semibold text-center">
                    {tx.amount.toLocaleString()} {tx.currency}
                  </td>

                  <td className="col-span-2 capitalize text-center text-gray-600">
                    {tx.type}
                  </td>

                  <td className="col-span-2 text-gray-500 text-center">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>

                  <td className="col-span-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tx.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : tx.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= Mobile ================= */}
        <div className="lg:hidden space-y-4 p-4">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {tx.employeeName}
                  </h3>
                  <p className="text-sm text-gray-500">{tx.employeePosition}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {tx.employeeEmail}
                  </p>
                </div>

                <span className="font-semibold text-right whitespace-nowrap">
                  {tx.amount.toLocaleString()} {tx.currency}
                </span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400 border-t pt-2">
                {tx.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Type:
                  </span>
                  <p className="font-medium capitalize">{tx.type}</p>
                </div>

                <div>
                  <span className="text-gray-500 dark:text-gray-400">
                    Date:
                  </span>
                  <p className="font-medium">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <span
                className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                  tx.status === "completed"
                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                    : tx.status === "pending"
                      ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-100"
                      : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100"
                }`}
              >
                {tx.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
