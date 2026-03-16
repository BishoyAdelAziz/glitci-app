import Modal from "@/components/ui/Modal";
import useTransactions from "@/hooks/useTransactions";
import type { Transaction } from "@/types/transactions";

interface Props {
  transaction: Transaction | null; // null = closed
  onClose: () => void;
}

export default function DeleteTransactionModal({
  transaction,
  onClose,
}: Props) {
  const {
    deleteTransactionMutation,
    deleteTransactionIsPending,
    deleteTransactionIsError,
    deleteTransactionError,
  } = useTransactions();

  const handleDelete = () => {
    if (!transaction) return;
    deleteTransactionMutation(transaction._id, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Modal isOpen={!!transaction} onClose={onClose} size="xl">
      <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-900 space-y-6">
        {/* Icon */}
        <div className="text-red-500 w-20 h-20">
          <svg
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            className="w-full h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </div>

        {/* Message */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Delete Transaction
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete{" "}
            <span className="font-semibold text-red-600 capitalize">
              {transaction?.category.replace(/_/g, " ")}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-red-600">
              {transaction?.amount.toLocaleString()} {transaction?.currency}
            </span>
            ?
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This action cannot be undone.
          </p>
        </div>

        {/* Error */}
        {deleteTransactionIsError && (
          <p className="text-sm text-red-500 text-center">
            {(deleteTransactionError as any)?.message ??
              "Something went wrong."}
          </p>
        )}

        {/* Buttons */}
        <div className="w-full flex items-center justify-center gap-4">
          <button
            onClick={onClose}
            disabled={deleteTransactionIsPending}
            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteTransactionIsPending}
            className="px-6 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-25 justify-center"
          >
            {deleteTransactionIsPending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
