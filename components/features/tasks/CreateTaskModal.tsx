"use client";

import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Modal from "@/components/ui/Modal";
import TextInput from "@/components/forms/TextInput";
import DateTimeInput from "@/components/forms/DateTimeInput";
import { SelectInput } from "@/components/forms/SelectInput";
import useEmployees from "@/hooks/useEmployees";
import useProjects from "@/hooks/useProjects";
import useTasks from "@/hooks/useTasks";
import toast from "react-hot-toast";
import { CreateTaskSchema } from "@/services/validations/tasks";

// ─── Multi-Task Schema ──────────────────────────────────────────────────────────

const BulkCreateSchema = z.object({
  tasks: z.array(CreateTaskSchema).min(1, "At least one task is required"),
});

type BulkCreateFormFields = z.infer<typeof BulkCreateSchema>;

// ─── Sub-Component for Task Row ─────────────────────────────────────────────────

interface TaskRowProps {
  index: number;
  field: any;
  remove: (index: number) => void;
  fieldsLength: number;
  control: any;
  register: any;
  errors: any;
  setValue: any;
  employeeOptions: { id: string; name: string }[];
}

function TaskRow({
  index,
  field,
  remove,
  fieldsLength,
  control,
  register,
  errors,
  setValue,
  employeeOptions,
}: TaskRowProps) {
  const EmployeeId = useWatch({
    control,
    name: `tasks.${index}.assignedTo`,
  });

  const { projects } = useProjects(EmployeeId ? { employee: EmployeeId } : undefined);

  const projectOptions =
    projects?.map((p: any) => ({ id: p._id || p.id, name: p.name })) ?? [];

  return (
    <div
      key={field.id}
      className="bg-[#F6F6F6] dark:bg-gray-800/50 rounded-2xl p-6 relative"
    >
      {/* Remove button */}
      {fieldsLength > 1 && (
        <button
          type="button"
          onClick={() => remove(index)}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors group"
        >
          <svg
            className="w-3.5 h-3.5 text-gray-400 group-hover:text-red-500 transition-colors"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Task Number Label */}
      {fieldsLength > 1 && (
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
          Task {index + 1}
        </p>
      )}

      {/* Task Name */}
      <TextInput
        label="Task Name"
        name={`tasks.${index}.name`}
        register={register}
        errors={errors}
        required
        placeholder="Enter task name"
      />

      {/* Description */}
      <div className="w-full">
        <label className="inline-flex items-center gap-1 font-bold">
          Description
          <span className="inline text-sm font-light text-gray-500">
            (optional)
          </span>
        </label>
        <textarea
          {...register(`tasks.${index}.description`)}
          placeholder="Briefly describe the task..."
          rows={3}
          className="w-full rounded-lg p-3 bg-[#EEEEEE] dark:bg-gray-900 dark:ring-1 dark:ring-gray-400 outline-none placeholder:text-xs placeholder:opacity-35 transition-colors resize-none mt-1"
        />
      </div>

      {/* Start & End Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <DateTimeInput
          label="Start Time"
          name={`tasks.${index}.startTime`}
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          required
        />
        <DateTimeInput
          label="End Time"
          name={`tasks.${index}.endTime`}
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          required
        />
      </div>

      {/* Employee & Project */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
        <SelectInput
          label="Assigned Employee"
          name={`tasks.${index}.assignedTo`}
          options={employeeOptions}
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          required
          placeholder="Select employee"
        />
        <SelectInput
          label="Project"
          name={`tasks.${index}.project`}
          options={projectOptions}
          register={register}
          errors={errors}
          setValue={setValue}
          control={control}
          placeholder="Assign to project"
        />
      </div>

      {/* Link */}
      <div className="mt-2">
        <TextInput
          label="Reference Link"
          name={`tasks.${index}.link`}
          register={register}
          errors={errors}
          placeholder="https://"
          type="url"
        />
      </div>
    </div>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateTaskModal({ isOpen, onClose }: Props) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<BulkCreateFormFields>({
    resolver: zodResolver(BulkCreateSchema),
    defaultValues: {
      tasks: [
        {
          name: "",
          description: "",
          startTime: "",
          endTime: "",
          assignedTo: "",
          project: "",
          link: "",
        },
      ],
    },
  });
  const { employees } = useEmployees();
  const { CreateTasksMutation, CreateTasksIsPending } = useTasks();

  const refinedEmployees = employees?.map((employee) => ({
    id: employee.id,
    name: employee.user.name,
  })) ?? [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const onSubmit = (data: BulkCreateFormFields) => {
    // Clean up empty optional fields
    const cleaned = data.tasks.map((t) => ({
      name: t.name,
      startTime: new Date(t.startTime).toISOString(),
      endTime: new Date(t.endTime).toISOString(),
      assignedTo: t.assignedTo,
      ...(t.description ? { description: t.description } : {}),
      ...(t.project ? { project: t.project } : {}),
      ...(t.link ? { link: t.link } : {}),
    }));

    CreateTasksMutation(
      { tasks: cleaned },
      {
        onSuccess: (res) => {
          toast.success(res.message || `${cleaned.length} task(s) created!`);
          reset();
          onClose();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to create tasks");
        },
      },
    );
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="full">
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-xl font-bold">Create New Task</h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Task Forms */}
        <div className="px-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {fields.map((field, index) => (
            <TaskRow
              key={field.id}
              index={index}
              field={field}
              remove={remove}
              fieldsLength={fields.length}
              control={control}
              register={register}
              errors={errors}
              setValue={setValue}
              employeeOptions={refinedEmployees}
            />
          ))}
        </div>

        {/* Add Another Task */}
        <div className="px-6 pt-4">
          <button
            type="button"
            onClick={() =>
              append({
                name: "",
                description: "",
                startTime: "",
                endTime: "",
                assignedTo: "",
                project: "",
                link: "",
              })
            }
            className="flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
            Add Another Task
          </button>
        </div>

        {/* Submit */}
        <div className="p-6">
          <button
            type="submit"
            disabled={CreateTasksIsPending}
            className="w-full rounded-[30px] bg-linear-to-r from-[#DE4646] to-[#B72D2D] py-4 font-semibold text-white text-lg transition-all ease-in-out duration-500 hover:bg-linear-to-l hover:from-[#B72D2D] hover:to-[#DE4646] disabled:opacity-50 disabled:cursor-wait"
          >
            {CreateTasksIsPending
              ? "Creating..."
              : `Create ${fields.length} Task${fields.length > 1 ? "s" : ""}`}
          </button>
        </div>
      </form>
    </Modal>
  );
}

