"use client";

type Payment = {
  id: string;
  amount: number;
  currency: string;
  date: string;
  type: string;
};

type PaymentGroup = {
  project: {
    id: string;
    name: string;
    budget: number;
    currency: string;
    client: {
      id: string;
      name: string;
      companyName: string;
    };
  };
  payments: Payment[];
  summary: {
    totalPayments: number;
    totalCollected: number;
    balanceDue: number;
    percentagePaid: number;
    currency: string;
  };
};

export type Transaction = {
  id: string;
  amount: number;
  currency: string;
  date: string;
  type: string;
  projectName: string;
  clientName: string;
  status: string;
  paymentMethod: string;
  description: string;
};
interface Props {
  data: Transaction[];
}

export default function ClientTransactionsTable({ data }: Props) {
  if (!data?.length) {
    return (
      <div className="text-center py-6 text-gray-500">
        No transactions found
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div>
        <h3 className="font-bold text-gray-500 text-xl">Client Transactions</h3>
        <div className="bg-linear-to-r from-[#DE4646] h-1 w-22 mt-2 to-[#B72D2D]" />
      </div>

      <div className="w-full overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-sm ring-[0.02rem] ring-gray-300">
        {/* ================= Desktop ================= */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full grid">
            <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <tr className="grid grid-cols-12 gap-4 px-6 py-4 text-sm font-semibold   text-gray-700 dark:text-gray-300">
                <th className="col-span-2 text-center">Project</th>
                <th className="col-span-2 text-center">Client</th>
                <th className="col-span-2 text-center">Amount</th>
                <th className="col-span-2 center">Method</th>
                <th className="col-span-2 text-center">Date</th>
                <th className="col-span-2 text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {data.map((tx) => (
                <tr
                  key={tx.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 text-sm items-center border-gray-200 dark:border-gray-700 border-b"
                >
                  <td className="col-span-2 font-medium text-center">
                    {tx.projectName}
                  </td>

                  <td className="col-span-2 text-gray-600 text-center">
                    {tx.clientName}
                  </td>

                  <td className="col-span-2 font-semibold text-center">
                    {tx.amount.toLocaleString()} {tx.currency}
                  </td>

                  <td className="col-span-2 capitalize text-center  text-gray-600">
                    {tx.paymentMethod}
                  </td>

                  <td className="col-span-2 text-gray-500 text-center">
                    {new Date(tx.date).toLocaleDateString()}
                  </td>

                  <td className="col-span-2 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
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
          {data.map((tx) => (
            <div
              key={tx.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 space-y-3 border"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-semibold">{tx.projectName}</h3>
                  <p className="text-sm text-gray-500">{tx.clientName}</p>
                </div>

                <span className="font-semibold">
                  {tx.amount.toLocaleString()} {tx.currency}
                </span>
              </div>

              <p className="text-sm text-gray-500 text-center">
                {tx.description}
              </p>

              <div className="grid grid-cols-2 text-sm">
                <div>
                  <span className="text-gray-400">Method:</span>{" "}
                  {tx.paymentMethod}
                </div>

                <div>
                  <span className="text-gray-400">Date:</span>{" "}
                  {new Date(tx.date).toLocaleDateString()}
                </div>
              </div>

              <span
                className={`inline-block px-2 py-1 text-xs rounded-full ${
                  tx.status === "completed"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
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
