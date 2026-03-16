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
import { Position } from "@/types/positions";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  position: Position;
  setSelectedPosition: Dispatch<SetStateAction<Position | null>>;
}
export default function EditPositionModal({
  isOpen,
  setIsOpen,
  position,
  setSelectedPosition,
}: Props) {
  const {
    updatePositionError,
    updatePositionIsError,
    updatePositionIsPending,
    updatePositionMutation,
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
    defaultValues: {
      name: position.name,
      description: position.description,
      department: position.department?.id,
    },
  });
  const onSubmit = (data) => {
    updatePositionMutation(
      { positionId: position.id, data },
      {
        onSuccess: () => {
          reset();
          setIsOpen(false);
        },
      },
    );
  };
  const refinedDepartments = departments?.map((department) => ({
    id: department.id,
    name: department.name,
  }));
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setSelectedPosition(null);
      }}
      size="full"
    >
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
          isError={updatePositionIsError}
          isPending={updatePositionIsPending}
          text="Edit Position"
          error={updatePositionError}
        />
      </form>
    </Modal>
  );
}
