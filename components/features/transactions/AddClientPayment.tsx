"use client";
import {
  clientPaymentSchema,
  ClientPaymentFormData,
} from "@/services/validations/transactions";
import { useProjects } from "@/hooks/useProjects";
import useClients from "@/hooks/useClients";
import useTransactions from "@/hooks/useTransactions";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/ui/Modal";
import { SelectInput } from "@/components/forms/SelectInput";
import TextInput from "@/components/forms/TextInput";
import SubmitButton from "@/components/forms/SubmitButton";
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddClientPaymentModal({ isOpen, onClose }: Props) {
  const { projects } = useProjects();
  const { clients } = useClients({ limit: 1000 });
  const {
    createClientPaymentTransactionError,
    createClientPaymentTransactionIsError,
    createClientPaymentTransactionIsPending,
    createClientPaymentTransactionMutation,
  } = useTransactions();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ClientPaymentFormData>({
    resolver: zodResolver(clientPaymentSchema) as any,
    defaultValues: {
      currency: "EGP",
      paymentMethod: "instapay",
      status: "completed",
    },
  });

  const refinedProjects = projects?.map((p) => ({ id: p.id, name: p.name }));
  const refinedClients = clients?.map((c) => ({ id: c.id, name: c.name }));

  const onSubmit = (data: ClientPaymentFormData) => {
    createClientPaymentTransactionMutation(
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
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-6 space-y-5 bg-white dark:bg-gray-900"
      >
        <div className="mb-2">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add Client Payment
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Record an incoming payment from a client
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Client */}
          <SelectInput
            label="Client"
            name="client"
            register={register}
            setValue={setValue}
            control={control}
            errors={errors}
            options={refinedClients}
            placeholder="Select client"
            saveAsId
            required
          />

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
            required
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
              { id: "instapay", name: "InstaPay" },
              { id: "cash", name: "Cash" },
              { id: "card", name: "Card" },
              { id: "wallet", name: "Wallet" },
              { id: "other", name: "Other" },
            ]}
            placeholder="Payment method"
          />

          {/* Status */}
          <SelectInput
            label="Status"
            name="status"
            register={register}
            control={control}
            setValue={setValue}
            errors={errors}
            saveAsId
            options={[
              { id: "completed", name: "Completed" },
              { id: "pending", name: "Pending" },
              { id: "cancelled", name: "Cancelled" },
            ]}
            placeholder="Select Status"
          />

          {/* Reference */}
          <TextInput
            label="Reference"
            name="reference"
            register={register}
            errors={errors}
          />

          {/* Description */}
          <TextInput
            label="Description"
            name="description"
            register={register}
            errors={errors}
          />
        </div>

        <SubmitButton
          isPending={createClientPaymentTransactionIsPending}
          isError={createClientPaymentTransactionIsError}
          error={createClientPaymentTransactionError}
          text="Add Payment"
        />
      </form>
    </Modal>
  );
}
