"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PasswordInput from "@/components/forms/PasswordInput";
import SubmitButton from "@/components/forms/SubmitButton";
import {
  resetPasswordSchema,
  ResetPasswordFormData,
} from "@/services/validations/auth";
import useAuth from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/AuthStore";

export default function ResetPasswordPage() {
  const { email } = useAuthStore();
  const router = useRouter();

  const {
    ResetPasswordError,
    ResetPasswordIsError,
    ResetPasswordIsPending,
    ResetPasswordMutation,
  } = useAuth();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    ResetPasswordMutation(
      { email, newPassword: data.newPassword },
      {
        onSuccess: () => {
          router.push("/login");
        },
      },
    );
  };

  return (
    <div className="flex flex-col w-[80%] items-start gap-8 justify-between">
      <div className="flex flex-col items-start gap-y-2">
        <h3 className="font-bold text-3xl">Assign your new password</h3>
        <p className="text-sm text-muted-foreground">
          Setting a new password for{" "}
          <span className="font-medium">{email}</span>
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full items-start gap-y-5"
      >
        <PasswordInput
          errors={errors}
          label="New Password"
          name="newPassword"
          register={register}
          required
        />
        <PasswordInput
          errors={errors}
          label="Confirm Password"
          name="confirmPassword"
          register={register}
          required
        />

        <Link
          href={"/forgot-password"}
          className="text-[#DE4646] font-poppins capitalize hover:underline underline-offset-4 text-xs"
        >
          Back to login ?
        </Link>

        <SubmitButton
          error={ResetPasswordError}
          isError={ResetPasswordIsError}
          isPending={ResetPasswordIsPending}
          text="Reset Password"
        />
      </form>
    </div>
  );
}
