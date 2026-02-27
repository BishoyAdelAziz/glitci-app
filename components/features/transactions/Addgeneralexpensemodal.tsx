"use client";
import useTransactions from "@/hooks/useTransactions";
import {
  generalExpenseSchema,
  GeneralExpenseFormData,
} from "@/services/validations/transactions";
import { useProjects } from "@/hooks/useProjects";
import useEmployees from "@/hooks/useEmployees";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/ui/Modal";
import { SelectInput } from "@/components/forms/SelectInput";
import TextInput from "@/components/forms/TextInput";
import DateInput from "@/components/forms/DateInput";
import SubmitButton from "@/components/forms/SubmitButton";
import type { ExpenseCategory } from "@/types/transactions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Pre-sets the category when opened from a specific category route */
  defaultCategory?: GeneralExpenseFormData["category"];
}

const GENERAL_EXPENSE_CATEGORIES: {
  id: GeneralExpenseFormData["category"];
  name: string;
}[] = [
  { id: "equipment", name: "Equipment" },
  { id: "software", name: "Software" },
  { id: "marketing", name: "Marketing" },
  { id: "office", name: "Office" },
  { id: "utilities", name: "Utilities" },
  { id: "other_expense", name: "Other Expense" },
];

const CATEGORY_LABELS: Record<GeneralExpenseFormData["category"], string> = {
  equipment: "Equipment",
  software: "Software",
  marketing: "Marketing",
  office: "Office",
  utilities: "Utilities",
  other_expense: "Other Expense",
};

export default function AddGeneralExpenseModal({
  isOpen,
  onClose,
  defaultCategory,
}: Props) {
  const { projects } = useProjects();
  const {
    createTransactionMutation,
    createTransactionIsPending,
    createTransactionIsError,
    createTransactionError,
  } = useTransactions();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<GeneralExpenseFormData, unknown, GeneralExpenseFormData>({
    resolver: zodResolver(generalExpenseSchema) as any,
    defaultValues: {
      currency: "EGP",
      paymentMethod: "cash",
      project: undefined,
      ...(defaultCategory ? { category: defaultCategory } : {}),
    },
  });

  const activeCategory = watch("category");
  const categoryLabel = activeCategory
    ? CATEGORY_LABELS[activeCategory]
    : "Expense";
  const refinedProjects = projects?.map((p) => ({ id: p.id, name: p.name }));
  const onSubmit = (data: GeneralExpenseFormData) => {
    if (!data.project) delete data.project;

    createTransactionMutation(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 space-y-5 bg-white dark:bg-gray-900"
      >
        <div className="mb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add {categoryLabel}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Record a company expense
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Category — hidden/locked when defaultCategory is passed */}
          {!defaultCategory ? (
            <SelectInput
              label="Category"
              name="category"
              register={register}
              setValue={setValue}
              control={control}
              errors={errors}
              saveAsId={false}
              options={GENERAL_EXPENSE_CATEGORIES}
              placeholder="Select category"
              required
            />
          ) : null}

          {/* Project */}
          <SelectInput
            label="Project"
            name="project"
            register={register}
            setValue={setValue}
            control={control}
            errors={errors}
            options={refinedProjects}
            placeholder="Select project"
            saveAsId
          />

          {/* Amount */}
          <TextInput
            label="Amount"
            name="amount"
            register={register}
            errors={errors}
            required
            numbersOnly
          />

          {/* Currency */}
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

          {/* Payment Method */}
          <SelectInput
            label="Payment Method"
            name="paymentMethod"
            register={register}
            setValue={setValue}
            control={control}
            errors={errors}
            saveAsId
            options={[
              { id: "cash", name: "Cash" },
              { id: "instapay", name: "InstaPay" },
              { id: "card", name: "Card" },
              { id: "wallet", name: "Wallet" },
              { id: "other", name: "Other" },
            ]}
            placeholder="Payment method"
          />

          {/* Reference */}
          <TextInput
            label="Reference"
            name="reference"
            register={register}
            errors={errors}
          />

          {/* Description — full width */}
          <div className="sm:col-span-2">
            <TextInput
              label="Description"
              name="description"
              register={register}
              errors={errors}
              required
            />
          </div>
        </div>

        <SubmitButton
          isPending={createTransactionIsPending}
          isError={createTransactionIsError}
          error={createTransactionError}
          text={`Add ${categoryLabel}`}
        />
      </form>
    </Modal>
  );
}
