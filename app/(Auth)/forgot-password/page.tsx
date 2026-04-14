"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import TextInput from "@/components/forms/TextInput";
import PasswordInput from "@/components/forms/PasswordInput";
import SubmitButton from "@/components/forms/SubmitButton";

import {
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "@/services/validations/auth";
import Link from "next/link";
import useAuth from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/AuthStore";
export default function ForgotPasswordPage() {
  const { email, setEmail } = useAuthStore();
  const router = useRouter();
  const {
    ForgotPasswordError,
    ForgotPasswordMutation,
    ForgotPasswordisError,
    ForgotPasswordisPending,
  } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    ForgotPasswordMutation(data, {
      onSuccess: () => {
        setEmail(data.email);
        router.push("/verify-code");
      },
    });
  };
  return (
    <div className="flex flex-col w-[80%] items-start gap-8 justify-between">
      <div className="flex flex-col items-start gap-y-5">
        <h3 className="font-bold text-3xl">Reset your password</h3>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full items-start gap-y-5"
      >
        <TextInput
          errors={errors}
          label="email"
          name="email"
          register={register}
          required
        />

        <Link
          href={"/login"}
          className="text-[#DE4646] font-poppins capitalize hover:underline underline-offset-4 text-xs"
        >
          Back to login ?
        </Link>
        <SubmitButton
          error={ForgotPasswordError}
          isError={ForgotPasswordisError}
          isPending={ForgotPasswordisPending}
          text="Reset Password"
        />
      </form>
    </div>
  );
}
