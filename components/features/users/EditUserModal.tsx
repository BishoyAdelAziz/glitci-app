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
import { User } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  user: User;
}
export default function EditUserModal({ isOpen, setIsOpen, user }: Props) {
  const {
    UpdateUserError,
    UpdateUserIsError,
    UpdateUserIsPending,
    UpdateUserMutate,
  } = UseUsers();
  useEffect(() => {
    if (user) {
      reset({
        name: user.name || "",
        email: user.email || "",
        role: (user.role as string) || "",
      });
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    reset,
  } = useForm({
    resolver: zodResolver(AddUserSchema),
    reValidateMode: "onChange",
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      role: (user?.role as string) || "",
    },
  });

  const onSubmit: SubmitHandler<AddUserSchemaTypes> = async (data, id) => {
    UpdateUserMutate(
      { ...data, id: user?.id as string },
      {
        onSuccess: () => {
          reset();
          setIsOpen(false);
        },
      },
    );
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
          errors={errors}
          required
          control={control}
          placeholder="Choose User"
          label="User Role"
          name="role"
          options={[
            { id: "Admin", name: "Admin" },
            { id: "operation", name: "Operation" },
            { id: "financial manager", name: "Financial Manager" },
          ]}
          register={register}
          setValue={setValue}
          saveAsId
        />

        <div className="col-span-2">
          <SubmitButton
            isError={UpdateUserIsError}
            isPending={UpdateUserIsPending}
            error={UpdateUserError}
            text="Update User"
          />
        </div>
      </form>
    </Modal>
  );
}
