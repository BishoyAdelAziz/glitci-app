// components/projects/EditProjectModal.tsx
"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";

import TextInput from "@/components/forms/TextInput";
import { SelectInput } from "@/components/forms/SelectInput";
import { EmployeeArrayInput } from "@/components/forms/EmployeeInput";
import SubmitButton from "@/components/forms/SubmitButton";
import Modal from "@/components/ui/Modal";

import useProjects from "@/hooks/useProjects";
import { useProject } from "@/hooks/useProject";
import useClients from "@/hooks/useClients";
import useDepartments from "@/hooks/useDepartments";
import useServices from "@/hooks/useServices";
import useEmployees from "@/hooks/useEmployees";

import {
  ProjectEditFormData,
  ProjectEditSchema,
} from "@/services/validations/project";

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
  const {
    register,
    handleSubmit,
    setValue,
    reset,
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

  // ─── Data fetching ─────────────────────────────────────────────────────────
  const {
    project,
    isLoading: singleProjectIsPending,
    isError: singleProjectIsError,
  } = useProject(projectId);

  const {
    UpdateProjectMutation,
    UpdateProjectIsPending,
    UpdateProjectIsError,
    UpdateProjectError,
  } = useProjects();

  const { clients } = useClients({ limit: 1000 });
  const { departments } = useDepartments({ limit: 1000 });
  const { services } = useServices();
  const { employees } = useEmployees({ limit: 1000 });

  const refinedEmployees = useMemo(
    () => employees?.map((e) => ({ id: e.id, name: e.user.name })) ?? [],
    [employees],
  );

  const isReady = !!project && refinedEmployees.length > 0 && isOpen;

  useEffect(() => {
    if (!isReady) return;

    const employeeData =
      project.employees?.map((e) => ({
        employee: e.id,
        compensation: e.compensation?.toString() ?? "",
        currency: e.currency ?? "EGP",
      })) ?? [];

    reset({
      name: project.name,
      budget: String(project.budget),
      currency: project.currency,
      status: project.status,
      employees: employeeData,
    });
  }, [isReady, project, reset]);

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<ProjectEditFormData> = (data) => {
    if (!projectId) return;
    UpdateProjectMutation(
      { id: projectId, data },
      {
        onSuccess: () => {
          onClose();
          reset();
        },
      },
    );
  };

  if (!projectId) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      {singleProjectIsPending ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
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

          <div className="col-span-2 w-[40%] mx-auto">
            <SubmitButton
              isError={UpdateProjectIsError}
              isPending={UpdateProjectIsPending}
              text="Update Project"
              error={UpdateProjectError}
            />
          </div>
        </form>
      )}
    </Modal>
  );
}
