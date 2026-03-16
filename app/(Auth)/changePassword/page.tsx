"use client";
import { useForm } from "react-hook-form";
import PasswordInput from "@/components/forms/PasswordInput";
import SubmitButton from "@/components/forms/SubmitButton";
import useAuth from "@/hooks/useAuth";
import {
  ChangePasswordFormData,
  changePasswordSchema,
} from "@/services/validations/auth";
import { zodResolver } from "@hookform/resolvers/zod";
export default function ChangePasseordPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const {
    ChangePasswordIsError,
    ChangePasswordIsPending,
    ChangePasswordMutation,
    ChangePasswordError,
  } = useAuth();

  const onSubmit = (data: ChangePasswordFormData) => {
    ChangePasswordMutation({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };
  return (
    <div className="flex flex-col items-center gap-8 w-full md:w-[70%] justify-between">
      <div className="flex flex-col items-start gap-y-5">
        <h3 className="font-bold text-3xl">Chnage Password</h3>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full items-start gap-y-5"
      >
        <PasswordInput
          label="Current Password"
          required
          errors={errors}
          name="currentPassword"
          register={register}
        />
        <div className="flex w-full flex-col items-stretch justify-center gap-4">
          <PasswordInput
            label="New Password"
            required
            errors={errors}
            name="newPassword"
            register={register}
          />
          <PasswordInput
            label="Confirm New Password"
            required
            errors={errors}
            name="ConfirmPassword"
            register={register}
          />
        </div>
        <SubmitButton
          error={ChangePasswordError}
          isError={ChangePasswordIsError}
          isPending={ChangePasswordIsPending}
          text="Change Password"
        />
      </form>
    </div>
  );
}
