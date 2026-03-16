"use client";
import { useForm } from "react-hook-form";
import PasswordInput from "@/components/forms/PasswordInput";
import SubmitButton from "@/components/forms/SubmitButton";
import useAuth from "@/hooks/useAuth";
export default function InitialPasswordPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({});

  const {
    SetInitialPasswordIsError,
    SetInitialPasswordIsPending,
    SetInitialPasswordMutation,
    SetInitialPasswordError,
  } = useAuth();

  const onSubmit = (data) => {
    SetInitialPasswordMutation({ newPassword: data.newPassword });
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full md:w-[70%] justify-between">
      <div className="flex flex-col w-full items-center justify-start gap-y-8">
        <p className="bg-linear-to-r from-[#DE4646] text-white to-[#B72D2D] px-8 rounded-xl capitalize font-poppins font-semibold py-3">
          Thank You for choosing {process.env.NEXT_PUBLIC_APP_NAME} App
        </p>
        <div className="space-y-6 w-full">
          <h3 className="font-bold text-start text-3xl">Assign Password</h3>

          <p className="font-sans font-semibold ">
            Check Your E-Mail Assign Your New Account Password to use it Securly
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full items-start gap-y-5"
      >
        <PasswordInput
          label="New Password"
          required
          errors={errors}
          name="newPassword"
          register={register}
        />
        <SubmitButton
          error={SetInitialPasswordError}
          isError={SetInitialPasswordIsError}
          isPending={SetInitialPasswordIsPending}
          text="Set Password"
        />
      </form>
    </div>
  );
}
