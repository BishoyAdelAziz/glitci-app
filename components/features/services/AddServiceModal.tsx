"use client";

import { SelectInput } from "@/components/forms/SelectInput";
import SubmitButton from "@/components/forms/SubmitButton";
import TextInput from "@/components/forms/TextInput";
import Modal from "@/components/ui/Modal";
import useDepartments from "@/hooks/useDepartments";
import useServices from "@/hooks/useServices";
import {
  AddServiceFormFields,
  AddServiceSchema,
} from "@/services/validations/services";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function AddServiceModal({ isOpen, setIsOpen }: Props) {
  const { departments } = useDepartments();
  const {
    CreateServiceError,
    CreateServiceIsError,
    CreateServiceMutation,
    CreateServiceIsPending,
  } = useServices();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<AddServiceFormFields>({
    resolver: zodResolver(AddServiceSchema),
    reValidateMode: "onChange",
  });
  const onSubmit = (data) => {
    CreateServiceMutation(data, {
      onSuccess: () => {
        setIsOpen(false);
      },
    });
  };
  const refinedDepartments = departments?.map((department) => ({
    id: department.id,
    name: department.name,
  }));
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <form
        className="space-y-6 p-8 bg-white overflow-y-scroll scrollbar-hidden dark:bg-gray-900 grid grid-cols-1 gap-x-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        <TextInput
          errors={errors}
          register={register}
          label="Service Name"
          name="name"
          required
          textOnly
        />
        <TextInput
          errors={errors}
          register={register}
          label="Description"
          name="description"
          required
          textOnly
        />
        <SelectInput
          control={control}
          errors={errors}
          register={register}
          setValue={setValue}
          name="department"
          options={refinedDepartments}
          label="Department"
          placeholder="Select Department"
        />
        <SubmitButton
          isError={CreateServiceIsError}
          isPending={CreateServiceIsPending}
          error={CreateServiceError}
          text="Add Service"
        />
      </form>
    </Modal>
  );
}
