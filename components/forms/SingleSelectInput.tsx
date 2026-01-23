"use client";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import Label from "./Label";
import ValidationError from "../Errors/validationError";

interface Option {
  id: string;
  name: string;
}

interface SingleSelectProps {
  name: string;
  label: string;
  options: Option[];
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  saveAsId?: boolean; // save value as ID instead of name
}

export const SingleSelectInput = ({
  name,
  label,
  options,
  register,
  errors,
  required = false,
  disabled = false,
  placeholder = "Select an option",
  className = "",
  saveAsId = true,
}: SingleSelectProps) => {
  return (
    <div className={`w-full ${className}`}>
      <Label name={name} id={name} label={label} required={required} />
      <select
        id={name}
        {...register(name, {
          required,
          setValueAs: (value) => value || "",
        })}
        disabled={disabled}
        className={`mt-1 block w-full rounded-[30px] border p-4 px-5 ring-black-400 focus-within:ring-1 ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.id} value={saveAsId ? option.id : option.name}>
            {option.name}
          </option>
        ))}
      </select>
      <ValidationError errors={errors} name={name} />
    </div>
  );
};
