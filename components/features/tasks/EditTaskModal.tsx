"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/ui/Modal";
import TextInput from "@/components/forms/TextInput";
import { SelectInput } from "@/components/forms/SelectInput";
import useTasks from "@/hooks/useTasks";
import useEmployees from "@/hooks/useEmployees";
import useProjects from "@/hooks/useProjects";
import toast from "react-hot-toast";
import { UpdateTaskSchema, UpdateTaskFormFields } from "@/services/validations/tasks";
import type { Task } from "@/types/tasks";
import { Dispatch, SetStateAction } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  task: Task;
  setSelectedTask: Dispatch<SetStateAction<Task | null>>;
}

export default function EditTaskModal({ isOpen, setIsOpen, task, setSelectedTask }: Props) {
  const { UpdateTaskMutation, UpdateTaskIsPending } = useTasks();
  const { employees } = useEmployees();
  const { projects } = useProjects();

  const employeeOptions = [
    { id: "", name: "All Employees" },
    ...(employees?.map((e) => ({ id: e.id, name: e.user.name })) ?? []),
  ];
  const projectOptions = [
    { id: "", name: "All Projects" },
    ...(projects?.map((p: any) => ({ id: p._id || p.id, name: p.name })) ?? []),
  ];

  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<UpdateTaskFormFields>({
    resolver: zodResolver(UpdateTaskSchema),
    defaultValues: {
      name: task.name ?? "",
      description: task.description ?? "",
      assignedTo: task.assignedTo?._id ?? task.assignedTo?.id ?? "",
      project: task.project?._id ?? "",
      links: task.links ?? [],
    },
  });

  const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({ control, name: "links" });

  const onSubmit = (data: UpdateTaskFormFields) => {
    const payload = {
      ...(data.name ? { name: data.name } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.assignedTo ? { assignedTo: data.assignedTo } : {}),
      ...(data.project ? { project: data.project } : {}),
      ...(data.links && data.links.length > 0 ? { links: data.links } : {}),
    };
    UpdateTaskMutation(
      { id: task.id || task._id!, data: payload },
      {
        onSuccess: () => {
          toast.success("Task updated!");
          reset();
          setIsOpen(false);
          setSelectedTask(null);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to update task");
        },
      },
    );
  };

  const handleClose = () => { setIsOpen(false); setSelectedTask(null); };

  return (
    <Modal key={task.id} isOpen={isOpen} onClose={handleClose} size="full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold">Edit Task</h2>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[300px]">{task.name}</p>
          </div>
          <button type="button" onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
          <TextInput label="Task Name" name="name" register={register} errors={errors} placeholder="Enter task name" />
          <div className="w-full">
            <label className="inline-flex items-center gap-1 font-bold text-sm">Description <span className="font-light text-gray-500">(optional)</span></label>
            <textarea {...register("description")} placeholder="Briefly describe the task..." rows={3} className="w-full rounded-lg p-3 bg-[#EEEEEE] dark:bg-gray-900 dark:ring-1 dark:ring-gray-400 outline-none placeholder:text-xs placeholder:opacity-35 resize-none mt-1" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput label="Assigned Employee" name="assignedTo" options={employeeOptions} register={register} errors={errors} setValue={setValue} control={control} placeholder="Select employee" />
            <SelectInput label="Project" name="project" options={projectOptions} register={register} errors={errors} setValue={setValue} control={control} placeholder="Assign to project (optional)" />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold text-sm">Reference Links</label>
              <button type="button" onClick={() => appendLink({ name: "", url: "" })} className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" /></svg>
                Add Link
              </button>
            </div>
            {linkFields.length === 0 && <p className="text-xs text-gray-400 italic">No links added.</p>}
            <div className="space-y-3">
              {linkFields.map((lf, li) => (
                <div key={lf.id} className="flex gap-2 items-start">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <TextInput label="" name={`links.${li}.name`} register={register} errors={errors} placeholder="Label (e.g. Figma)" />
                    <TextInput label="" name={`links.${li}.url`} register={register} errors={errors} placeholder="https://" type="url" />
                  </div>
                  <button type="button" onClick={() => removeLink(li)} className="mt-1 w-7 h-7 shrink-0 rounded-full bg-red-50 dark:bg-red-900/30 flex items-center justify-center hover:bg-red-100 transition-colors group">
                    <svg className="w-3.5 h-3.5 text-red-400 group-hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
          <button type="submit" disabled={UpdateTaskIsPending} className="w-full rounded-[30px] bg-linear-to-r from-[#DE4646] to-[#B72D2D] py-4 font-semibold text-white text-lg transition-all ease-in-out duration-500 hover:bg-linear-to-l hover:from-[#B72D2D] hover:to-[#DE4646] disabled:opacity-50 disabled:cursor-wait">
            {UpdateTaskIsPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
