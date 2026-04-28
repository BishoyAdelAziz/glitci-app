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
import { UpdateAssetSchema, UpdateAssetFormFields } from "@/services/validations/assets";
import type { Asset } from "@/types/assets";
import { Dispatch, SetStateAction } from "react";

interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  asset: Asset;
  setSelectedAsset: Dispatch<SetStateAction<Asset | null>>;
}

export default function EditAssetModal({ isOpen, setIsOpen, asset, setSelectedAsset }: Props) {
  const { updateAssetMutation, updateAssetIsPending } = useAssets();
  const { clients } = useClients();
  const { projects } = useProjects();

  const clientOptions = [
    { id: "", name: "All Clients" },
    ...(clients?.map((c: any) => ({ id: c._id || c.id, name: c.name })) ?? []),
  ];
  const projectOptions = [
    { id: "", name: "All Projects" },
    ...(projects?.map((p: any) => ({ id: p._id || p.id, name: p.name })) ?? []),
  ];

  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<UpdateAssetFormFields>({
    resolver: zodResolver(UpdateAssetSchema),
    defaultValues: {
      name: asset.name ?? "",
      url: asset.url ?? "",
      description: asset.description ?? "",
      client: asset.client?.id ?? "",
      project: asset.project?.id ?? "",
    },
  });

  const handleClose = () => { setIsOpen(false); setSelectedAsset(null); };

  const onSubmit = (data: UpdateAssetFormFields) => {
    updateAssetMutation(
      { id: asset.id || asset._id || "", data },
      {
        onSuccess: () => {
          toast.success("Asset updated!");
          reset();
          handleClose();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to update asset");
        },
      },
    );
  };

  return (
    <Modal key={asset.id || asset._id} isOpen={isOpen} onClose={handleClose} size="full">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-bold">Edit Asset</h2>
            <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[300px]">{asset.name}</p>
          </div>
          <button type="button" onClick={handleClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          <TextInput label="Asset Name" name="name" register={register} errors={errors} placeholder="e.g. Brand Guidelines PDF" />
          <TextInput label="URL" name="url" register={register} errors={errors} placeholder="https://" type="url" />
          <div className="w-full">
            <label className="font-bold text-sm">Description</label>
            <textarea {...register("description")} placeholder="Briefly describe this asset..." rows={3} className="w-full rounded-lg p-3 bg-[#EEEEEE] dark:bg-gray-900 dark:ring-1 dark:ring-gray-400 outline-none placeholder:text-xs placeholder:opacity-35 resize-none mt-1" />
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectInput label="Client" name="client" options={clientOptions} register={register} errors={errors} setValue={setValue} control={control} placeholder="Select client (optional)" />
            <SelectInput label="Project" name="project" options={projectOptions} register={register} errors={errors} setValue={setValue} control={control} placeholder="Select project (optional)" />
          </div>
        </div>

        <div className="p-6 border-t border-gray-100 dark:border-gray-800">
          <button type="submit" disabled={updateAssetIsPending} className="w-full rounded-[30px] bg-linear-to-r from-[#DE4646] to-[#B72D2D] py-4 font-semibold text-white text-lg transition-all ease-in-out duration-500 hover:bg-linear-to-l hover:from-[#B72D2D] hover:to-[#DE4646] disabled:opacity-50 disabled:cursor-wait">
            {updateAssetIsPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
