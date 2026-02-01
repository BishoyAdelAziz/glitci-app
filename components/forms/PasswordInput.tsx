"use client";
import Image from "next/image";
import { useState } from "react";
import { UseFormRegister, FieldErrors, FieldError } from "react-hook-form";
import Label from "./Label";

interface Props {
  name: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  rest?: React.InputHTMLAttributes<HTMLInputElement>;
  label: string;
  required?: boolean;
}

const PasswordInput = ({
  name,
  placeholder,
  register,
  errors,
  label,
  required,
  ...rest
}: Props) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // Get the specific error for the field
  const error = errors[name];
  // Get the error message (if present)
  const errorMessage = error && (error as FieldError)?.message;

  return (
    <div className="flex flex-col items-start gap-2 w-full">
      <Label label={label} name={name} required />
      <div
        className={`focus:border-secondary flex gap-2 w-full rounded-lg p-4 border border-[#CFCFCF] dark:border-gray-700 outline-none placeholder:text-xs placeholder:opacity-35 transition-colors ${
          errors[name as any]?.message ? "border-red-500" : ""
        }`}
      >
        <input
          className="outline-none bg-transparent w-full"
          {...register(name)}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...rest}
        />
        {showPassword ? (
          // ✅ Eye Slash (Hide) - stroke="currentColor"
          <div className="w-[10%] flex justify-center items-center rounded-md cursor-pointer hover:opacity-70">
            <svg
              className="w-5 h-5" // ✅ Matches your reference
              fill="none"
              stroke="currentColor" // ✅ Auto light/dark mode
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleShowPassword}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
              />
            </svg>
          </div>
        ) : (
          // ✅ Eye (Show) - stroke="currentColor"
          <div className="w-[10%] flex justify-center items-center rounded-md cursor-pointer hover:opacity-70">
            <svg
              className="w-5 h-5" // ✅ Matches your reference
              fill="none"
              stroke="currentColor" // ✅ Auto light/dark mode
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              onClick={handleShowPassword}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
        )}
      </div>
      {errorMessage && (
        <p className="pr-5 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default PasswordInput;
