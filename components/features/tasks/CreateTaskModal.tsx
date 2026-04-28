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
import useAssets from "@/hooks/useAssets";
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

function TaskRowForm({
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
  const EmployeeId = useWatch({ control, name: `tasks.${index}.assignedTo` });
  const ProjectId = useWatch({ control, name: `tasks.${index}.project` });

  const { projects } = useProjects(EmployeeId ? { employee: EmployeeId } : undefined);
  const { assets } = useAssets(ProjectId ? { project: ProjectId } : undefined);

  const projectOptions = [
    { id: "", name: "All Projects" },
    ...(projects?.map((p: any) => ({ id: p._id || p.id, name: p.name })) ?? []),
  ];

  const assetOptions =
    assets?.flatMap((group) => group.assets).map((a) => ({ 
      id: a.id, 
      name: a.name,
      url: a.url
    })) ?? [];

  // Watch current links for selection state (to keep in sync with manual edits)
  const watchedLinks = useWatch({ control, name: `tasks.${index}.links` }) || [];

  const isAssetSelected = (asset: { name: string; url: string }) => {
    return watchedLinks.some((f: any) => f.url === asset.url && f.name === asset.name);
  };

  const toggleAsset = (asset: { name: string; url: string }) => {
    const existingIndex = watchedLinks.findIndex(
      (f: any) => f.url === asset.url && f.name === asset.name
    );
    if (existingIndex > -1) {
      removeLink(existingIndex);
    } else {
      appendLink({ name: asset.name, url: asset.url });
    }
  };

  // Nested links field array
  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({ control, name: `tasks.${index}.links` });

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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
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
      <div className="w-full mt-4">
        <label className="inline-flex items-center gap-1 font-bold">
          Description
          <span className="inline text-sm font-light text-gray-500">(optional)</span>
        </label>
        <textarea
          {...register(`tasks.${index}.description`)}
          placeholder="Briefly describe the task..."
          rows={3}
          className="w-full rounded-lg p-3 bg-[#EEEEEE] dark:bg-gray-900 dark:ring-1 dark:ring-gray-400 outline-none placeholder:text-xs placeholder:opacity-35 transition-colors resize-none mt-1"
        />
      </div>

      {/* Start & End Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
          placeholder="Assign to project (optional)"
        />
      </div>

      {/* Assets Reference (interactive selection) */}
      {assets && assets.length > 0 && (
        <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
          <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {ProjectId ? "Project Assets" : "Available Assets (By Client)"}
          </p>
          
          {ProjectId ? (
            <div className="flex flex-wrap gap-2">
              {assetOptions.map((asset) => {
                const selected = isAssetSelected(asset);
                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => toggleAsset(asset)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                      selected 
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                        : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/40"
                    }`}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {selected ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      )}
                    </svg>
                    {asset.name}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {assets.map((group) => (
                <div key={group.clientId}>
                  <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                    {group.clientName}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {group.assets.map((asset) => {
                      const selected = isAssetSelected(asset);
                      return (
                        <button
                          key={asset.id}
                          type="button"
                          onClick={() => toggleAsset(asset)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            selected 
                              ? "bg-blue-600 text-white border-blue-600 shadow-sm" 
                              : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/40"
                          }`}
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {selected ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            )}
                          </svg>
                          {asset.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Links */}
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <label className="font-bold text-sm flex items-center gap-1">
            Reference Links
            <span className="text-sm font-light text-gray-500">(optional)</span>
          </label>
          <button
            type="button"
            onClick={() => appendLink({ name: "", url: "" })}
            className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
            </svg>
            Add Link
          </button>
        </div>

        {linkFields.length === 0 && (
          <p className="text-xs text-gray-400 italic">No links added yet.</p>
        )}

        <div className="space-y-3">
          {linkFields.map((lf, li) => (
            <div key={lf.id} className="flex gap-2 items-start">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                <TextInput
                  label="Link Name"
                  name={`tasks.${index}.links.${li}.name`}
                  register={register}
                  errors={errors}
                  placeholder="Link label (e.g. Figma)"
                  required
                />
                <TextInput
                  label="Link Url"
                  name={`tasks.${index}.links.${li}.url`}
                  register={register}
                  errors={errors}
                  placeholder="https://"
                  type="url"
                  required
                />
              </div>
              <button
                type="button"
                onClick={() => removeLink(li)}
                className="mt-1 w-7 h-7 shrink-0 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/60 transition-colors group"
              >
                <svg className="w-3.5 h-3.5 text-red-400 group-hover:text-red-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
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
          links: [],
        },
      ],
    },
  });
  const { employees } = useEmployees();
  const { CreateTasksMutation, CreateTasksIsPending } = useTasks();

  const refinedEmployees = [
    { id: "", name: "All Employees" },
    ...(employees?.map((employee) => ({
      id: employee.id,
      name: employee.user.name,
    })) ?? []),
  ];

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tasks",
  });

  const onSubmit = (data: BulkCreateFormFields) => {
    const cleaned = data.tasks.map((t) => ({
      name: t.name,
      startTime: new Date(t.startTime).toISOString(),
      endTime: new Date(t.endTime).toISOString(),
      assignedTo: t.assignedTo,
      ...(t.description ? { description: t.description } : {}),
      ...(t.project ? { project: t.project } : {}),
      ...(t.links && t.links.length > 0 ? { links: t.links } : {}),
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
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Task Forms */}
        <div className="px-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {fields.map((field, index) => (
            <TaskRowForm
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
                links: [],
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
