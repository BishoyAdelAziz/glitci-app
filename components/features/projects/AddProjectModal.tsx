"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import DateInput from "@/components/forms/DateInput";
import { EmployeeArrayInput } from "@/components/forms/EmployeeInput";
import MultiSelect from "@/components/forms/MultiSelect";
import { SelectInput } from "@/components/forms/SelectInput";
import SubmitButton from "@/components/forms/SubmitButton";
import TextInput from "@/components/forms/TextInput";
import Modal from "@/components/ui/Modal";
import UseEmployees from "@/hooks/useEmployees";
import { useProjects } from "@/hooks/useProjects";
import useDepartments from "@/hooks/useDepartments";
import useClients from "@/hooks/useClients";
import useServices from "@/hooks/useServices";
import { ProjectFormData, projectSchema } from "@/services/validations/project";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProjectModal({ isOpen, onClose }: Props) {
  // ✅ Fetch data and mutations only
  const { createProject, isCreating, CreateError, isCreateError } =
    useProjects();

  // ✅ Form is defined HERE in the component
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
    reset,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
  });

  const departmentId = watch("department");

  const { employees } = UseEmployees({ limit: 1000, employeeId: undefined });
  const { departments } = useDepartments({ limit: 1000 });
  const { services } = useServices({ department: departmentId });
  const { clients } = useClients({ limit: 1000 });

  const refinedEmployees = employees?.map((employee) => ({
    id: employee.id,
    name: employee.user.name,
  }));

  const refinedDepartments = departments?.map((department) => ({
    id: department.id,
    name: department.name,
  }));

  const refinedClients = clients?.map((client) => ({
    id: client.id,
    name: client.name,
  }));

  const refinedServices = services?.map((service) => ({
    id: service.id,
    name: service.name,
  }));

  const onSubmit = async (data: ProjectFormData) => {
    try {
      createProject(data);
      reset();
      onClose();
    } catch (error) {
      console.error("Create failed:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-8 bg-white dark:bg-gray-900 grid grid-cols-2 gap-x-6"
      >
        <TextInput
          errors={errors}
          label="Project Name"
          name="name"
          register={register}
          required
        />

        <TextInput
          errors={errors}
          label="Description"
          name="description"
          register={register}
          required
        />

        <SelectInput
          errors={errors}
          label="Client"
          name="client"
          register={register}
          setValue={setValue}
          placeholder="Select Client"
          required
          saveAsId
          options={refinedClients}
          control={control}
        />

        <SelectInput
          errors={errors}
          label="Department"
          name="department"
          register={register}
          setValue={setValue}
          placeholder="Select Department"
          required
          saveAsId
          options={refinedDepartments}
          control={control}
        />

        <TextInput
          errors={errors}
          label="Budget"
          name="budget"
          register={register}
          required
          numbersOnly
        />

        <SelectInput
          name="currency"
          label="Currency"
          saveAsId={false}
          register={register}
          setValue={setValue}
          required
          placeholder="Select Currency"
          errors={errors}
          options={[
            { name: "EGP", id: "EGP" },
            { name: "SAR", id: "SAR" },
            { name: "AED", id: "AED" },
            { name: "USD", id: "USD" },
            { name: "EUR", id: "EUR" },
          ]}
          control={control}
        />

        <DateInput
          control={control}
          errors={errors}
          label="Start Date"
          name="startDate"
          required
        />

        <DateInput
          control={control}
          errors={errors}
          label="End Date"
          name="endDate"
          required
        />

        <SelectInput
          errors={errors}
          label="Priority"
          name="priority"
          options={[
            { name: "low", id: "low" },
            { name: "medium", id: "medium" },
            { name: "high", id: "high" },
          ]}
          register={register}
          setValue={setValue}
          required
          placeholder="Select Priority"
          saveAsId
          control={control}
        />

        <SelectInput
          errors={errors}
          label="Status"
          name="status"
          options={[
            { name: "Planning", id: "planning" },
            { name: "In Progress", id: "active" },
            { name: "On Hold", id: "on_hold" },
            { name: "Completed", id: "completed" },
          ]}
          register={register}
          setValue={setValue}
          required
          placeholder="Select Status"
          saveAsId
          control={control}
        />

        <div className="col-span-2">
          <MultiSelect
            control={control}
            errors={errors}
            label="Services"
            name="services"
            required
            saveAs="id"
            options={refinedServices}
          />

          <EmployeeArrayInput
            label="Employees"
            name="employees"
            required
            employees={refinedEmployees}
            register={register}
            control={control}
            errors={errors}
            setValue={setValue}
          />
        </div>

        <div className="col-span-2 w-[40%] mx-auto">
          <SubmitButton
            isError={isCreateError}
            isPending={isCreating}
            text="Create Project"
            error={CreateError}
          />
        </div>
      </form>
    </Modal>
  );
}
