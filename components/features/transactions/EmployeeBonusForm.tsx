"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SelectInput } from "@/components/forms/SelectInput";
import TextInput from "@/components/forms/TextInput";
import SubmitButton from "@/components/forms/SubmitButton";
import { useProjects } from "@/hooks/useProjects";
import useEmployees from "@/hooks/useEmployees";
import useTransactions from "@/hooks/useTransactions";

const bonusSchema = z.object({
  employee: z.string().min(1, "Employee is required"),
  amount: z.coerce.number().positive("Amount must be positive"),
  currency: z.enum(["EGP", "SAR", "AED", "USD", "EUR"]),
  project: z.string().optional(),
  description: z.string().optional(),
  reference: z.string().optional(),
});

type BonusFormData = z.infer<typeof bonusSchema>;

interface Props {
  onClose: () => void;
}

export default function EmployeeBonusForm({ onClose }: Props) {
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
  } = useForm<BonusFormData, unknown, BonusFormData>({
    resolver: zodResolver(bonusSchema) as any,
    defaultValues: { currency: "EGP" },
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

  const onSubmit = (data: BonusFormData) => {
    SalaryMutaiton(
      { ...data, type: "expense", category: "employee_bonus" },
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
          placeholder="Select project"
          saveAsId
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
        />
      </div>

      <SubmitButton
        isPending={SalaryMutaitonIsPending}
        isError={SalaryMutaitonIsError}
        error={SalaryMutaitonError}
        text="Add Bonus"
      />
    </form>
  );
}
