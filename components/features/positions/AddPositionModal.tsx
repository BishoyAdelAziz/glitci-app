import Modal from "@/components/ui/Modal";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateDepartmentSchema } from "@/services/validations/departments";
import TextInput from "@/components/forms/TextInput";
import SubmitButton from "@/components/forms/SubmitButton";
import useDepartments from "@/hooks/useDepartments";
import usePositions from "@/hooks/usePositions";
import { AddPositionSchema } from "@/services/validations/positions";
import { SelectInput } from "@/components/forms/SelectInput";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function AddPositionModal({ isOpen, setIsOpen }: Props) {
  const {
    createPositionError,
    createPositionIsError,
    createPositionIsPending,
    createPositionMutation,
  } = usePositions();
  const { departments } = useDepartments();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm({
    resolver: zodResolver(AddPositionSchema),
    reValidateMode: "onChange",
  });
  const onSubmit = (data) => {
    createPositionMutation(data, {
      onSuccess: () => {
        reset();
        setIsOpen(false);
      },
    });
  };
  const refinedDepartments = departments?.map((department) => ({
    id: department.id,
    name: department.name,
  }));
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-8 bg-white overflow-y-scroll scrollbar-hidden dark:bg-gray-900 grid grid-cols-1 gap-x-6"
      >
        <TextInput
          errors={errors}
          label="Position Name"
          name="name"
          register={register}
          required={true}
        />
        <SelectInput
          register={register}
          setValue={setValue}
          control={control}
          errors={errors}
          label="department"
          options={refinedDepartments}
          name="department"
          saveAsId
          required
          placeholder="Select Department"
        />
        <TextInput
          errors={errors}
          label="Description"
          name="description"
          register={register}
          required={true}
        />

        <SubmitButton
          isError={createPositionIsError}
          isPending={createPositionIsPending}
          text="Add Position"
          error={createPositionError}
        />
      </form>
    </Modal>
  );
}
