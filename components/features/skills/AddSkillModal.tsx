import Modal from "@/components/ui/Modal";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/forms/TextInput";
import SubmitButton from "@/components/forms/SubmitButton";
import useDepartments from "@/hooks/useDepartments";
import usePositions from "@/hooks/usePositions";
import {
  AddPositionFormFields,
  AddPositionSchema,
} from "@/services/validations/positions";
import { SelectInput } from "@/components/forms/SelectInput";
import {
  AddSkillFormFIelds,
  AddSkillSchema,
} from "@/services/validations/skill";
import useSkills from "@/hooks/useSkills";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function AddSkillModal({ isOpen, setIsOpen }: Props) {
  const {
    createSkillError,
    createSkillIsError,
    createSkillIsPending,
    createSkillMutation,
  } = useSkills();
  const { positions } = usePositions();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    reset,
  } = useForm<AddSkillFormFIelds>({
    resolver: zodResolver(AddSkillSchema),
    reValidateMode: "onChange",
  });
  const onSubmit = (data) => {
    const refinedData = {
      ...data,
      name: data.name.trim().split(/\s+/),
    };

    createSkillMutation(refinedData, {
      onSuccess: () => {
        reset();
        setIsOpen(false);
      },
    });
  };
  const refinedDepartments = positions?.map((position) => ({
    id: position.id,
    name: position.name,
  }));
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-8 bg-white overflow-y-scroll scrollbar-hidden dark:bg-gray-900 grid grid-cols-1 gap-x-6"
      >
        <TextInput
          errors={errors}
          label="Skills"
          name="name"
          register={register}
          required={true}
          placeholder="Leave Space between each skill"
        />
        <SelectInput
          register={register}
          setValue={setValue}
          control={control}
          errors={errors}
          label="Position"
          options={refinedDepartments}
          name="position"
          saveAsId
          required
          placeholder="Select Position"
        />

        <SubmitButton
          isError={createSkillIsError}
          isPending={createSkillIsPending}
          text="Add Skil"
          error={createSkillError}
        />
      </form>
    </Modal>
  );
}
