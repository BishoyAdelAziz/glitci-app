"use client";

import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import MultiSelect from "@/components/forms/MultiSelect";
import { SelectInput } from "@/components/forms/SelectInput";
import SubmitButton from "@/components/forms/SubmitButton";
import TextInput from "@/components/forms/TextInput";
import Modal from "@/components/ui/Modal";
import useDepartments from "@/hooks/useDepartments";
import useEmployees from "@/hooks/useEmployees";
import usePositions from "@/hooks/usePositions";
import useSkills from "@/hooks/useSkills";
import {
  AddEmployeeFormFIelds,
  AddEmployeeSchema,
} from "@/services/validations/employees";
import { Employee } from "@/types/employees";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  employee: Employee;
}

export default function EditEmployeeModal({
  isOpen,
  setIsOpen,
  employee,
}: Props) {
  // ✅ Add type and zodResolver
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<AddEmployeeFormFIelds>({
    resolver: zodResolver(AddEmployeeSchema),
    defaultValues: {
      name: employee.user.name,
      email: employee.user.email,
      phone: employee.user.phone,
      department: employee.department.id,
      position: employee.position.id,
      skills: employee.skills.map((skill) => skill.id),
    },
  });

  const departmentId = watch("department");
  const positionId = watch("position");

  const { departments } = useDepartments();
  const { positions } = usePositions({ department: departmentId });
  const { skills } = useSkills({ position: positionId });
  const {
    updateEmployeeError,
    updateEmployeeIsError,
    updateEmployeeIsPending,
    updateEmployeeMutation,
  } = useEmployees();

  const refinedDepartments = departments?.map((department) => ({
    id: department.id,
    name: department.name,
  }));

  const refinedPositions = positions?.map((position) => ({
    id: position.id,
    name: position.name,
  }));

  const refinedSkills = skills?.map((skill) => ({
    id: skill.id,
    name: skill.name,
  }));

  const onSubmit = async (data: AddEmployeeFormFIelds) => {
    updateEmployeeMutation(
      { id: employee.id, data },
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
        className="space-y-6 p-8 bg-white overflow-y-scroll scrollbar-hidden dark:bg-gray-900 grid grid-cols-2 gap-x-6"
      >
        <TextInput
          errors={errors}
          register={register}
          label="Employee Name"
          name="name"
          required
        />
        <TextInput
          errors={errors}
          label="Employee Email"
          name="email"
          register={register}
          required
        />
        <SelectInput
          control={control}
          errors={errors}
          label="Department"
          name="department"
          options={refinedDepartments}
          register={register}
          saveAsId
          placeholder="Select Department"
          setValue={setValue}
          required
        />
        <SelectInput
          control={control}
          errors={errors}
          label="Position"
          name="position"
          options={refinedPositions}
          register={register}
          saveAsId
          placeholder="Select Position"
          setValue={setValue}
          required
        />
        <div className="col-span-2">
          <MultiSelect
            control={control}
            errors={errors}
            label="Skills"
            name="skills"
            options={refinedSkills}
            saveAs="id"
            placeHolder="Select Skills"
            required
          />
        </div>
        <TextInput
          errors={errors}
          label="Phone Number"
          name="phone"
          register={register}
          required
          numbersOnly
        />
        <div className="col-span-2">
          <SubmitButton
            isError={updateEmployeeIsError}
            isPending={updateEmployeeIsPending}
            error={updateEmployeeError}
            text="Update Employee"
          />
        </div>
      </form>
    </Modal>
  );
}
