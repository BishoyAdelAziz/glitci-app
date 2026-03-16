import Modal from "@/components/ui/Modal";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateDepartmentSchema } from "@/services/validations/departments";
import TextInput from "@/components/forms/TextInput";
import SubmitButton from "@/components/forms/SubmitButton";
import useDepartments from "@/hooks/useDepartments";
interface Props {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}
export default function AddDepartmentModal({ isOpen, setIsOpen }: Props) {
  const {
    CreateDepartmentError,
    CreateDepartmentIsError,
    CreateDepartmentIsPending,
    CreateDepartmentMutation,
  } = useDepartments();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(CreateDepartmentSchema),
    reValidateMode: "onChange",
  });
  const onSubmit = (data) => {
    CreateDepartmentMutation(data, {
      onSuccess: () => {
        reset();
        setIsOpen(false);
      },
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-8 bg-white overflow-y-scroll scrollbar-hidden dark:bg-gray-900 grid grid-cols-1 gap-x-6"
      >
        <TextInput
          errors={errors}
          label="Department Name"
          name="name"
          register={register}
          required={true}
        />
        <SubmitButton
          isError={CreateDepartmentIsError}
          isPending={CreateDepartmentIsPending}
          text="Add Department"
          error={CreateDepartmentError}
        />
      </form>
    </Modal>
  );
}
