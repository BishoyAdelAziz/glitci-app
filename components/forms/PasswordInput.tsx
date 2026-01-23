"use client";
import Image from "next/image";
import { useState } from "react";
import { UseFormRegister, FieldErrors, FieldError } from "react-hook-form";

interface Props {
  name: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  rest?: React.InputHTMLAttributes<HTMLInputElement>;
}

const PasswordInput = ({
  name,
  placeholder,
  register,
  errors,
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
    <div className="flex flex-col gap-2 w-full">
      <div className="flex gap-2  rounded-lg p-4 white-dark border border-[#CFCFCF] outline-none placeholder:text-xs placeholder:opacity-35">
        <input
          className="w-full outline-none text-black dark:text-white"
          {...register(name)}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          {...rest}
        />
        {showPassword ? (
          <Image
            src="/icons/eye-show.svg"
            alt="image"
            width={24}
            height={24}
            onClick={handleShowPassword}
            className="cursor-pointer"
          />
        ) : (
          <Image
            src="/icons/eye-hide.svg"
            alt="image"
            width={24}
            height={24}
            onClick={handleShowPassword}
            className="cursor-pointer"
          />
        )}
      </div>
      {errorMessage && (
        <p className="pr-5 text-xs text-red-500">{errorMessage}</p>
      )}
    </div>
  );
};

export default PasswordInput;
