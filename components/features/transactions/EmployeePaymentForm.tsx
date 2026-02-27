"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SelectInput } from "@/components/forms/SelectInput";
import TextInput from "@/components/forms/TextInput";
import DateInput from "@/components/forms/DateInput";
import SubmitButton from "@/components/forms/SubmitButton";
import { useProjects } from "@/hooks/useProjects";
import useEmployees from "@/hooks/useEmployees";
import useTransactions from "@/hooks/useTransactions";

const PaymentSchema = z.object({
  employee: z.string().min(1, "Employee is required"),
  project: z.string().optional(),
  amount: z.coerce.number().positive("Amount must be positive"),
  currency: z.enum(["EGP", "SAR", "AED", "USD", "EUR"]),
  description: z.string().optional(),
  date: z.string().optional(),
  paymentMethod: z
    .enum(["cash", "instapay", "wallet", "card", "other"])
    .optional(),
  reference: z.string().optional(),
});

type PaymentFormData = z.infer<typeof PaymentSchema>;

interface Props {
  onClose: () => void;
}

export default function EmployeePaymentForm({ onClose }: Props) {
  const { projects } = useProjects();
  const { employees } = useEmployees({ limit: 1000 });
  const {
    SalaryMutaiton,
    SalaryMutaitonError,
    SalaryMutaitonIsError,
    SalaryMutaitonIsPending,
  } = useTransactions();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<PaymentFormData, unknown, PaymentFormData>({
    resolver: zodResolver(PaymentSchema) as any,
    defaultValues: { currency: "EGP", paymentMethod: "instapay" },
  });

  const refinedProjects = projects?.map((p) => ({ id: p.id, name: p.name }));
  const refinedEmployees = employees?.map((e) => ({
    id: e.id,
    name:
      e.user.name +
      " (" +
      e.employmentType
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()) +
      ")",
  }));

  const onSubmit = (data: PaymentFormData) => {
    SalaryMutaiton(
      { ...data },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectInput
          label="Employee"
          name="employee"
          register={register}
          setValue={setValue}
          control={control}
          errors={errors}
          options={refinedEmployees}
          placeholder="Select employee"
          saveAsId
          required
        />
        <SelectInput
          label="Project"
          name="project"
          register={register}
          setValue={setValue}
          control={control}
          errors={errors}
          options={refinedProjects}
          placeholder="Select Project"
          saveAsId
          required
        />

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
          label="Payment Method"
          name="paymentMethod"
          register={register}
          setValue={setValue}
          control={control}
          errors={errors}
          saveAsId
          options={[
            { id: "instapay", name: "InstaPay" },
            { id: "cash", name: "Cash" },
            { id: "card", name: "Card" },
            { id: "wallet", name: "Wallet" },
            { id: "other", name: "Other" },
          ]}
          placeholder="Payment method"
          required
        />

        <DateInput
          label="Date"
          name="date"
          placeholder="dd/mm/yyyy"
          control={control}
          errors={errors}
        />

        <TextInput
          label="Reference"
          name="reference"
          register={register}
          errors={errors}
        />

        <TextInput
          label="Description"
          name="description"
          register={register}
          errors={errors}
          placeholder="Auto Generated If Empty"
        />
      </div>

      <SubmitButton
        isPending={SalaryMutaitonIsPending}
        isError={SalaryMutaitonIsError}
        error={SalaryMutaitonError}
        text="Add Payment"
      />
    </form>
  );
}
