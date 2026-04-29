"use client";

import { SelectInput } from "@/components/forms/SelectInput";
import SubmitButton from "@/components/forms/SubmitButton";
import TextInput from "@/components/forms/TextInput";
import Modal from "@/components/ui/Modal";
import UseUsers from "@/hooks/useUsers";
import {
  AddUserSchema,
  AddUserSchemaTypes,
} from "@/services/validations/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function AddUserModal({ isOpen, setIsOpen }: Props) {
  const { AddUserError, AddUserIsError, AddUserIsPending, AddUserMuatate } =
    UseUsers({ isActive: true });
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(AddUserSchema),
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      role: "",
    },
  });

  const onSubmit: SubmitHandler<AddUserSchemaTypes> = async (data) => {
    AddUserMuatate(data, {
      onSuccess: () => {
        reset();
        setIsOpen(false);
      },
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-8 bg-white overflow-y-scroll scrollbar-hidden dark:bg-gray-900 grid grid-cols-2 gap-x-6"
      >
        <TextInput
          errors={errors}
          register={register}
          label="User Name"
          name="name"
          required
        />
        <TextInput
          errors={errors}
          label="User Email"
          name="email"
          register={register}
          required
        />
        <SelectInput
          control={control}
          errors={errors}
          label="User Role"
          name="role"
          options={[
            { id: "Admin", name: "Admin" },
            { id: "operation", name: "Operation" },
            { id: "financial manager", name: "Financial Manager" },
          ]}
          register={register}
          setValue={setValue}
        />

        <div className="col-span-2">
          <SubmitButton
            isError={AddUserIsError}
            isPending={AddUserIsPending}
            error={AddUserError}
            text="Add User"
          />
        </div>
      </form>
    </Modal>
  );
}
