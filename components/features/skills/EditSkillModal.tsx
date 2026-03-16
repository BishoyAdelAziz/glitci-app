import Modal from "@/components/ui/Modal";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "@/components/forms/TextInput";
import SubmitButton from "@/components/forms/SubmitButton";
import usePositions from "@/hooks/usePositions";

import { SelectInput } from "@/components/forms/SelectInput";
import {
  AddSkillFormFIelds,
  AddSkillSchema,
} from "@/services/validations/skill";
import useSkills from "@/hooks/useSkills";
import { Skill } from "@/types/skills";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  skill: Skill;
  setSelectedSkill: Dispatch<SetStateAction<Skill | null>>;
}
export default function EditSkillModal({
  isOpen,
  setIsOpen,
  skill,
  setSelectedSkill,
}: Props) {
  const {
    updateSkillError,
    updateSkillIsError,
    updateSkillIsPending,
    updateSkillMutation,
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
    defaultValues: {
      name: skill?.name || "",
      position: skill?.position?.id || "",
    },
  });
  const onSubmit = (data) => {
    const refinedData = {
      ...data,
      name: data.name.trim().split(/\s+/),
    };

    updateSkillMutation(
      { skillId: skill.id, data },
      {
        onSuccess: () => {
          reset();
          setIsOpen(false);
        },
      },
    );
  };
  const refinedDepartments = positions?.map((position) => ({
    id: position.id,
    name: position.name,
  }));
  return (
    <Modal
      key={skill.id}
      isOpen={isOpen}
      onClose={() => {
        setIsOpen(false);
        setSelectedSkill(null);
      }}
      size="full"
    >
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
          isError={updateSkillIsError}
          isPending={updateSkillIsPending}
          text="Edit Skil"
          error={updateSkillError}
        />
      </form>
    </Modal>
  );
}
