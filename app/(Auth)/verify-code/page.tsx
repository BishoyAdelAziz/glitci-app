"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import SubmitButton from "@/components/forms/SubmitButton";
import useAuth from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/AuthStore";
import Link from "next/link";

export default function VerifyCodePage() {
  const { email } = useAuthStore();
  const router = useRouter();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const formRef = useRef<HTMLFormElement | null>(null);
  const {
    VerifyCodeError,
    VerifyCodeIsError,
    VerifyCodeIsPending,
    VerifyCodeMutation,
    ForgotPasswordMutation,
  } = useAuth();
  const { handleSubmit } = useForm();

  const checkAndAutoSubmit = () => {
    const otp = inputsRef.current.map((el) => el?.value ?? "").join("");
    if (otp.length === 6 && /^\d{6}$/.test(otp)) {
      formRef.current?.requestSubmit();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    const inputs = inputsRef.current;

    if (e.key === "Backspace") {
      e.preventDefault();
      if (inputs[index]?.value) {
        inputs[index]!.value = "";
      } else if (index > 0) {
        inputs[index - 1]?.focus();
        inputs[index - 1]!.value = "";
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const input = e.currentTarget;
    const val = input.value.replace(/\D/g, "");
    input.value = val ? val[val.length - 1] : "";

    if (input.value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    checkAndAutoSubmit();
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!pasted) return;

    const inputs = inputsRef.current;
    pasted.split("").forEach((digit, i) => {
      const targetIndex = index + i;
      if (targetIndex < 6 && inputs[targetIndex]) {
        inputs[targetIndex]!.value = digit;
      }
    });

    const nextIndex = Math.min(index + pasted.length, 5);
    inputs[nextIndex]?.focus();

    checkAndAutoSubmit();
  };

  const getOtpValue = () =>
    inputsRef.current.map((el) => el?.value ?? "").join("");

  const onSubmit = () => {
    const otp = getOtpValue();
    console.log("OTP submitted:", otp);
    VerifyCodeMutation(
      { email, resetCode: otp },
      {
        onSuccess: () => {
          router.push("/reset-password");
        },
      },
    );
  };
  const ResendCode = () => {
    ForgotPasswordMutation({ email });
  };
  return (
    <div className="flex flex-col w-[80%] items-start gap-8 justify-between">
      <div className="flex flex-col items-start gap-y-2">
        <h3 className="font-bold text-3xl">Verify your code</h3>
        <p className="text-sm text-muted-foreground">
          You&apos;ve received a 6-digit OTP on{" "}
          <span className="font-medium">{email}</span>
        </p>
        <p
          onClick={ResendCode}
          className="text-[#DE4646] cursor-pointer font-poppins capitalize hover:underline underline-offset-4 text-xs"
        >
          Resend code ?
        </p>
      </div>

      <form
        ref={formRef}
        className="flex flex-col w-full items-start gap-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex gap-2 w-full justify-start">
          {Array.from({ length: 6 }).map((_, i) => (
            <input
              key={i}
              ref={(el) => {
                inputsRef.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              onKeyDown={(e) => handleKeyDown(e, i)}
              onInput={(e) => handleInput(e, i)}
              onPaste={(e) => handlePaste(e, i)}
              className="w-10 h-13 text-center text-xl font-medium  border-white border focus:border-none rounded-md focus:outline-none focus:ring-2 focus:ring-[#DE4646] transition"
            />
          ))}
        </div>

        <Link
          href={"/forgot-password"}
          className="text-[#DE4646] font-poppins capitalize hover:underline underline-offset-4 text-xs"
        >
          Change email ?
        </Link>
        <SubmitButton
          isError={false}
          text="Verify"
          error={null}
          isPending={false}
        />
      </form>
    </div>
  );
}
