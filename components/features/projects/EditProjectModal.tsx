"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";

import TextInput from "@/components/forms/TextInput";
import { SelectInput } from "@/components/forms/SelectInput";
import { MultiSelect } from "@/components/forms/MultiSelect";
import { EmployeeArrayInput } from "@/components/forms/EmployeeInput";
import DateInput from "@/components/forms/DateInput";
import SubmitButton from "@/components/forms/SubmitButton";
import Modal from "@/components/ui/Modal";

import { useProjects } from "@/hooks/useProjects";
import useClients from "@/hooks/useClients";
import useDepartments from "@/hooks/useDepartments";
import useServices from "@/hooks/useServices";
import UseEmployees from "@/hooks/useEmployees";

import {
  projectSchema,
  ProjectFormData,
  ProjectEditFormData,
  ProjectEditSchema,
} from "@/services/validations/project";
import { toDateInput } from "@/utils/functions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string | null;
}

export default function EditProjectModal({
  isOpen,
  onClose,
  projectId,
}: Props) {
  // ----- FORM -----
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ProjectEditFormData>({
    resolver: zodResolver(ProjectEditSchema),
    defaultValues: {
      name: "",
      budget: "",
      currency: "EGP",
      status: "planning",
      employees: [],
    },
  });

  // ----- FETCH DATA -----
  const {
    singleProject,
    singleProjectIsPending,
    singleProjectIsError,
    updateProjectError,
    updateProjectIsPending,
    updateProjectMutation,
    UpdateProjectIsError,
  } = useProjects({ id: projectId });
  const { clients } = useClients({ limit: 1000 });
  const { departments } = useDepartments({ limit: 1000 });
  const { services } = useServices();
  const { employees } = UseEmployees({ limit: 1000 });

  // ----- REFINED OPTIONS -----
  const refinedClients = useMemo(
    () => clients?.map((c) => ({ id: c.id, name: c.name })) || [],
    [clients],
  );
  const refinedDepartments = useMemo(
    () => departments?.map((d) => ({ id: d.id, name: d.name })) || [],
    [departments],
  );
  const refinedServices = useMemo(
    () => services?.map((s) => ({ id: s.id, name: s.name })) || [],
    [services],
  );
  const refinedEmployees = useMemo(
    () => employees?.map((e) => ({ id: e.id, name: e.user.name })) || [],
    [employees],
  );

  // ----- FIELD ARRAY FOR EMPLOYEES -----

  // ----- CHECK IF READY -----
  const isReady =
    singleProject &&
    refinedClients.length &&
    refinedDepartments.length &&
    refinedServices.length &&
    refinedEmployees.length;

  // ----- POPULATE FORM -----
  useEffect(() => {
    if (!isReady || !isOpen) return;

    // 1️⃣ Flat fields

    // 2️⃣ Employee array
    const employeeData =
      singleProject.employees?.map((e) => ({
        employee: e.id,
        compensation: e.compensation?.toString() || "",
        currency: e.currency || "EGP",
      })) || [];

    setValue("employees", employeeData);
    // replaceEmployees(employeeData || []);
    reset({
      name: singleProject.name,
      budget: String(singleProject.budget),
      currency: singleProject.currency,
      status: singleProject.status,
      employees: employeeData,

      // startDate: toDateInput(singleProject.startDate),
      // endDate: toDateInput(singleProject.endDate),
      // client: singleProject.client?._id,
      // department: singleProject.department?._id,
      // services: singleProject.services?.map((s) => s._id) || [],
    });
  }, [isReady, singleProject, isOpen, reset, setValue]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<ProjectEditFormData> = async (data) => {
    if (!projectId) return;
    try {
      updateProjectMutation(
        { id: projectId, data },
        {
          onSuccess: () => {
            onClose();
            reset();
          },
        },
      );
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (!projectId) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      {singleProjectIsPending ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : singleProjectIsError ? (
        <div className="p-8 text-center text-red-600 dark:text-red-400">
          Error loading project data
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-8 bg-white dark:bg-gray-900 grid grid-cols-2 gap-x-6"
        >
          {/* Text Inputs */}
          <TextInput
            errors={errors}
            label="Project Name"
            name="name"
            register={register}
            required
          />
          <TextInput
            errors={errors}
            label="Budget"
            name="budget"
            register={register}
            required
            numbersOnly
          />

          {/* Select Inputs */}
          {/* <SelectInput
            errors={errors}
            label="Client"
            name="client"
            register={register}
            setValue={setValue}
            options={refinedClients}
            placeholder="Select Client"
            required
            saveAsId
            control={control}
          /> */}
          {/* <SelectInput
            errors={errors}
            label="Department"
            name="department"
            register={register}
            setValue={setValue}
            options={refinedDepartments}
            placeholder="Select Department"
            required
            saveAsId
            control={control}
          /> */}
          <SelectInput
            errors={errors}
            label="Status"
            name="status"
            register={register}
            setValue={setValue}
            options={[
              { name: "Planning", id: "planning" },
              { name: "In Progress", id: "active" },
              { name: "On Hold", id: "on_hold" },
              { name: "Completed", id: "completed" },
            ]}
            placeholder="Select Status"
            required
            saveAsId
            control={control}
          />

          {/* MultiSelect */}
          {/* <MultiSelect
            control={control}
            errors={errors}
            label="Services"
            name="services"
            saveAs="id"
            options={refinedServices}
            required
          /> */}

          {/* Employee Array */}
          <div className="col-span-2">
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

          {/* Date Inputs */}
          {/* <DateInput
            control={control}
            errors={errors}
            label="Start Date"
            name="startDate"
            required
          /> */}
          {/* <DateInput
            control={control}
            errors={errors}
            label="End Date"
            name="endDate"
            required
          /> */}

          {/* Submit */}
          <div className="col-span-2 w-[40%] mx-auto">
            <SubmitButton
              isError={UpdateProjectIsError}
              isPending={updateProjectIsPending}
              text="Update Project"
              error={updateProjectError}
            />
          </div>
        </form>
      )}
    </Modal>
  );
}
