"use client";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SubmitButton from "@/components/forms/SubmitButton";
import TextInput from "@/components/forms/TextInput";
import Modal from "@/components/ui/Modal";
import { ClientSchema, AddClientSchema } from "@/services/validations/clients";
import { MultiPhonesInput } from "@/components/forms/MultiPhone";
import useClients from "@/hooks/useClients";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddClient({ isOpen, onClose }: Props) {
  const {
    AddClientMutation,
    AddClientMutationError,
    AddClientMutationIsError,
    AddClientMutationIsPending,
  } = useClients();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<AddClientSchema>({
    mode: "onChange", // Changed from reValidateMode
    resolver: zodResolver(ClientSchema),
    defaultValues: {
      name: "",
      companyName: "",
      email: "", // Optional field, can be empty
      industry: "",
      notes: "",
      phones: [""], // Important: Initialize with one empty phone
    },
  });

  const onSubmit: SubmitHandler<AddClientSchema> = (data: AddClientSchema) => {
    const payload = {
      ...data,
      email: data.email === "" ? null : data.email, // normalize here instead
    };

    AddClientMutation(payload, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-8 bg-white dark:bg-gray-900 grid grid-cols-2 gap-x-6"
      >
        <TextInput
          errors={errors}
          label="Name"
          name="name"
          register={register}
          required
        />
        <TextInput
          errors={errors}
          label="Company Name"
          name="companyName"
          register={register}
          required
        />
        <TextInput
          errors={errors}
          label="Email"
          name="email"
          register={register}
        />
        <TextInput
          errors={errors}
          label="Industry"
          name="industry"
          register={register}
          required
        />
        <div className="col-span-2">
          <TextInput
            errors={errors}
            label="Note"
            name="notes"
            register={register}
          />
        </div>
        <div className="col-span-2">
          <MultiPhonesInput
            control={control}
            errors={errors}
            name="phones"
            register={register}
          />
        </div>
        <div className="col-span-2 flex items-center justify-center w-[20%] mx-auto">
          <SubmitButton
            isError={AddClientMutationIsError}
            isPending={AddClientMutationIsPending}
            error={AddClientMutationError}
            text="Add Client"
          />
        </div>
      </form>
    </Modal>
  );
}
