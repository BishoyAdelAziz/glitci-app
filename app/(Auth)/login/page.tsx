"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import TextInput from "@/components/forms/TextInput";
import PasswordInput from "@/components/forms/PasswordInput";
import SubmitButton from "@/components/forms/SubmitButton";

import { loginSchema, LoginFormData } from "@/services/validations/auth";
import { useLogin } from "@/hooks/useLogin";

export default function LoginPage() {
  const router = useRouter();
  const { error, isError, isPending, mutate } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    mutate(data, {
      onSuccess: () => {
        router.push("/overview");
        router.refresh(); // refresh server components
      },
    });
  };

  return (
    <div className="flex flex-col items-center gap-8 justify-between">
      <div className="flex flex-col items-start gap-y-5">
        <h3 className="font-bold text-3xl">Login</h3>
        <p className="font-semibold text-2xl">Login to your account</p>
        <p className="text-2xl">
          Thank you for getting back to {process.env.NEXT_PUBLIC_APP_NAME},
          let’s access <br />
          the best recommendations for you.
        </p>
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

        <PasswordInput
          label="password"
          required
          errors={errors}
          name="password"
          register={register}
        />
        <SubmitButton
          error={error}
          isError={isError}
          isPending={isPending}
          text="LOGIN"
        />
      </form>
    </div>
  );
}
