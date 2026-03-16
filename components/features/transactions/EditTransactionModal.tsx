"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import { SelectInput } from "@/components/forms/SelectInput";
import TextInput from "@/components/forms/TextInput";
import DateInput from "@/components/forms/DateInput";
import SubmitButton from "@/components/forms/SubmitButton";
import useTransactions from "@/hooks/useTransactions";
import type { Transaction } from "@/types/transactions";

const editSchema = z.object({
  amount: z.coerce.number().positive("Amount must be positive"),
  currency: z.enum(["EGP", "USD", "EUR", "AED", "SAR"]),
  description: z.string().optional(),
  status: z.enum(["completed", "pending", "cancelled"]),
  date: z.string().optional(),
});

type EditFormData = z.infer<typeof editSchema>;

interface Props {
  transaction: Transaction | null; // null = closed
  onClose: () => void;
}

export default function EditTransactionModal({ transaction, onClose }: Props) {
  const {
    updateTransactionMutation,
    updateTransactionIsPending,
    updateTransactionIsError,
    updateTransactionError,
  } = useTransactions();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EditFormData>({
    resolver: zodResolver(editSchema) as any,
  });

  // Populate form whenever a new transaction is passed in
  useEffect(() => {
    if (transaction) {
      reset({
        amount: transaction.amount,
        currency: transaction.currency,
        date: transaction.date
          ? new Date(transaction.date).toISOString().split("T")[0]
          : "",
        status: transaction.status,
        description: transaction.description,
      });
    }
  }, [transaction, reset]);

  const onSubmit = (data: EditFormData) => {
    if (!transaction) return;
    updateTransactionMutation(
      { id: transaction._id, data },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  return (
    <Modal isOpen={!!transaction} onClose={onClose} size="lg">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 space-y-5 bg-white dark:bg-gray-900"
      >
        <div className="mb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Edit Transaction
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 capitalize">
            {transaction?.category.replace(/_/g, " ")} ·{" "}
            {transaction?.project?.name ?? "No project"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Amount"
            name="amount"
            register={register}
            errors={errors}
            required
            numbersOnly
          />

          <SelectInput
            label="Currency"
            name="currency"
            register={register}
            setValue={setValue}
            control={control}
            errors={errors}
            saveAsId={false}
            options={[
              { id: "EGP", name: "EGP" },
              { id: "USD", name: "USD" },
              { id: "EUR", name: "EUR" },
              { id: "AED", name: "AED" },
              { id: "SAR", name: "SAR" },
            ]}
            placeholder="Currency"
            required
          />

          <SelectInput
            label="Status"
            name="status"
            register={register}
            setValue={setValue}
            control={control}
            errors={errors}
            saveAsId
            options={[
              { id: "completed", name: "Completed" },
              { id: "pending", name: "Pending" },
              { id: "cancelled", name: "Cancelled" },
            ]}
            placeholder="Status"
            required
          />

          <DateInput
            label="Date"
            name="date"
            placeholder="dd/mm/yyyy"
            control={control}
            errors={errors}
          />

          <div className="sm:col-span-2">
            <TextInput
              label="Description"
              name="description"
              register={register}
              errors={errors}
            />
          </div>
        </div>

        <SubmitButton
          isPending={updateTransactionIsPending}
          isError={updateTransactionIsError}
          error={updateTransactionError}
          text="Save Changes"
        />
      </form>
    </Modal>
  );
}
