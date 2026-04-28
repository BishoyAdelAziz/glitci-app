"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import Modal from "@/components/ui/Modal";
import TextInput from "@/components/forms/TextInput";
import { MultiPhonesInput } from "@/components/forms/MultiPhone";
import useClients from "@/hooks/useClients";
import SubmitButton from "@/components/forms/SubmitButton";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  clientId: string;
}

export default function EditClientModal({ isOpen, onClose, clientId }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      industry: "",
      phones: [] as string[],
      notes: "",
      email: "",
      companyName: "",
    },
  });

  // ----- FETCH DATA -----
  const {
    singleClient,
    singleClientError,
    SingleCLientIsError,
    SingleClientIsPending,
    updateClientMutation,
    updateClientIsPending,
    updateClientError,
    UpdateClientIsError,
  } = useClients({ clientId: clientId });

  const isReady = singleClient?.data;
  const ClientPhones = singleClient?.data.phones;
  const ClientEmail = singleClient?.data.email;
  useEffect(() => {
    if (!isReady || !isOpen) return;

    reset({
      name: singleClient.data.name,
      industry: singleClient.data.industry,
      phones: ClientPhones,
      email: singleClient.data.email || "",
      notes: singleClient.data.notes || "",
      companyName: singleClient.data.companyName,
    });
  }, [isReady, singleClient, isOpen, reset]);

  // ----- RESET ON CLOSE -----
  useEffect(() => {
    if (!isReady || !isOpen) return;

    reset({
      name: singleClient.data.name,
      industry: singleClient.data.industry,
      phones: singleClient.data.phones || [],
      notes: singleClient.data.notes || "",
      email: singleClient.data.email || "",
      companyName: singleClient.data.companyName,
    });
  }, [isReady, singleClient, isOpen, reset]);
  // ----- SUBMIT HANDLER -----
  const onSubmit: SubmitHandler<any> = async (data) => {
    if (!clientId) return;
    try {
      updateClientMutation(
        { clientId: clientId, data },
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

  if (!clientId) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      {SingleClientIsPending ? (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : SingleCLientIsError ? (
        <div className="p-8 text-center text-red-600 dark:text-red-400">
          Error loading client data
        </div>
      ) : (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 p-8 bg-white dark:bg-gray-900 grid grid-cols-2 gap-x-6"
        >
          <TextInput
            errors={errors}
            label="Client Name"
            name="name"
            register={register}
          />
          <TextInput
            errors={errors}
            label="Industry"
            name="industry"
            register={register}
          />
          <TextInput
            errors={errors}
            label="Company Name"
            name="companyName"
            register={register}
          />
          <TextInput
            errors={errors}
            label="Email"
            name="email"
            register={register}
          />
          <TextInput
            errors={errors}
            label="Notes"
            name="notes"
            register={register}
          />
          <div className="col-span-2">
            <MultiPhonesInput
              control={control}
              errors={errors}
              name="phones"
              register={register}
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-2 w-[40%] mx-auto">
            <SubmitButton
              isError={UpdateClientIsError}
              isPending={updateClientIsPending}
              text="Update Client"
              error={updateClientError}
            />
          </div>
        </form>
      )}
    </Modal>
  );
}
