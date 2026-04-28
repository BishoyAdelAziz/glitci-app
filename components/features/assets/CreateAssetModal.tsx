"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Modal from "@/components/ui/Modal";
import TextInput from "@/components/forms/TextInput";
import { SelectInput } from "@/components/forms/SelectInput";
import useAssets from "@/hooks/useAssets";
import useClients from "@/hooks/useClients";
import useProjects from "@/hooks/useProjects";
import toast from "react-hot-toast";
import {
  CreateAssetSchema,
  CreateAssetFormFields,
} from "@/services/validations/assets";


interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateAssetModal({ isOpen, onClose }: Props) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
    watch
  } = useForm<CreateAssetFormFields>({
    resolver: zodResolver(CreateAssetSchema),
    defaultValues: {
      name: "",
      url: "",
      description: "",
      client: "",
      project: "",
    },
  });
  const clientId = watch("client")
  const { createAssetMutation, createAssetIsPending } = useAssets();
  const { clients } = useClients({limit:100});
  const { projects } = useProjects({client:clientId});

  const clientOptions = [
    { id: "", name: "All Clients" },
    ...(clients?.map((emp) => ({ id: emp.id, name: emp.name })) || []),
  ];

  const projectOptions = [
    { id: "", name: "All Projects" },
    ...(projects?.map((p: any) => ({ id: p._id || p.id, name: p.name })) ?? []),
  ];

  

  const onSubmit = (data: CreateAssetFormFields) => {
    const payload = {
      name: data.name,
      url: data.url,
      description: data.description,
      ...(data.client ? { client: data.client } : {}),
      ...(data.project ? { project: data.project } : {}),
    };

    createAssetMutation(payload, {
      onSuccess: () => {
        toast.success("Asset created successfully!");
        reset();
        onClose();
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to create asset");
      },
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold">Add New Asset</h2>
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

        <div className="p-6 space-y-5">
          <TextInput
            label="Asset Name"
            name="name"
            register={register}
            errors={errors}
            required
            placeholder="e.g. Brand Guidelines PDF"
          />

          <TextInput
            label="URL"
            name="url"
            register={register}
            errors={errors}
            required
            placeholder="https://"
            type="url"
          />

          <div className="w-full">
            <label className="inline-flex items-center gap-1 font-bold text-sm">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("description")}
              placeholder="Briefly describe this asset..."
              rows={3}
              className="w-full rounded-lg p-3 bg-[#EEEEEE] dark:bg-gray-900 dark:ring-1 dark:ring-gray-400 outline-none placeholder:text-xs placeholder:opacity-35 resize-none mt-1"
            />
            {errors.description && (
              <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput
              label="Client"
              name="client"
              options={clientOptions}
              register={register}
              errors={errors}
              setValue={setValue}
              control={control}
              placeholder="Select client (optional)"
              saveAsId
            />
            <SelectInput
              label="Project"
              name="project"
              options={projectOptions}
              register={register}
              errors={errors}
              setValue={setValue}
              control={control}
              placeholder="Select project (optional)"
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
          <button
            type="submit"
            disabled={createAssetIsPending}
            className="w-full rounded-[30px] bg-linear-to-r from-[#DE4646] to-[#B72D2D] py-4 font-semibold text-white text-lg transition-all ease-in-out duration-500 hover:bg-linear-to-l hover:from-[#B72D2D] hover:to-[#DE4646] disabled:opacity-50 disabled:cursor-wait"
          >
            {createAssetIsPending ? "Creating..." : "Create Asset"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
