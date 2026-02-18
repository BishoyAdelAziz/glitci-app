"use client";

import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import SubmitButton from "@/components/forms/SubmitButton";
import TextInput from "@/components/forms/TextInput";
import Modal from "@/components/ui/Modal";
import useDepartments from "@/hooks/useDepartments";

import { Department } from "@/types/departments";
import {
  AddDepartmentFormFIelds,
  CreateDepartmentSchema,
} from "@/services/validations/departments";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  department: Department | null;
}

export default function EditDepartmentModal({
  isOpen,
  setIsOpen,
  department,
}: Props) {
  // ✅ Add type and zodResolver
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<AddDepartmentFormFIelds>({
    resolver: zodResolver(CreateDepartmentSchema),
    defaultValues: {
      name: department?.name,
    },
  });

  const {
    EditDepartmentError,
    EditDepartmentIsError,
    EditDepartmentIsPending,
    EditDepartmentMutation,
  } = useDepartments();

  const onSubmit = async (data: AddDepartmentFormFIelds) => {
    EditDepartmentMutation(
      { id: department?.id, data },
      {
        onSuccess: () => {
          reset();
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
      }}
      size="full"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-8 bg-white overflow-y-scroll scrollbar-hidden dark:bg-gray-900 grid grid-cols-1 gap-x-6"
      >
        <TextInput
          errors={errors}
          register={register}
          label="Employee Name"
          name="name"
          required
        />
        <div className="col-span-2">
          <SubmitButton
            isError={EditDepartmentIsError}
            isPending={EditDepartmentIsPending}
            error={EditDepartmentIsError}
            text="Update Department"
          />
        </div>
      </form>
    </Modal>
  );
}
