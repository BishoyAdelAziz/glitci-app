"use client";

import { MultiPhonesInput } from "@/components/forms/MultiPhone";
import { MultiSelect } from "@/components/forms/MultiSelect";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Dispatch, SetStateAction } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function AddEmployeeMddal({ isOpen, setIsOpen }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(AddEmployeeSchema),
    reValidateMode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      department: "",
      position: "",
      skills: [],
    },
  });
  const Department = watch("department");
  const Position = watch("position");
  const { departments, error, isError, isLoading } = useDepartments();
  const { positions } = usePositions({ department: Department });
  const { Skills } = useSkills({ position: Position });
  const {
    AddEmployeeError,
    AddEmployeeIsError,
    AddEmployeeMutation,
    AddEmpoyeeIsPending,
  } = useEmployees();
  const refinedDepartments = departments?.map((department) => ({
    id: department.id,
    name: department.name,
  }));
  const refinedPositions = positions?.map((position) => ({
    id: position.id,
    name: position.name,
  }));

  const refinedSkills = Skills?.data.map((skill) => ({
    id: skill.id,
    name: skill.name,
  }));
  const EmploymentTypesOptions = [
    { id: "full_time", name: "Full Time" },
    { id: "part_time", name: "Part Time" },
    { id: "freelancer", name: "Freelancer" },
  ];
  console.log(refinedSkills);
  const onSubmit: SubmitHandler<AddEmployeeFormFIelds> = async (data) => {
    AddEmployeeMutation(data, {
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
          placeholder="Select Department"
          setValue={setValue}
          required
        />
        <SelectInput
          control={control}
          errors={errors}
          label="Employment Type"
          name="employmentType"
          options={EmploymentTypesOptions}
          register={register}
          saveAsId
          placeholder="Select EmployeeTime"
          setValue={setValue}
          required
        />
        <div className="col-span-2 h-auto">
          <MultiSelect
            control={control}
            errors={errors}
            label="Skills"
            name="skills"
            options={refinedSkills}
            saveAsId
            placeholder="SelectSkills"
            required
            disabled={!Position} // disable until position is selected
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
            isError={AddEmployeeIsError}
            isPending={AddEmpoyeeIsPending}
            error={AddEmployeeError}
            text="Add Employee"
          />
        </div>
      </form>
    </Modal>
  );
}
