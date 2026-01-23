"use client";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import Label from "./Label";
import ValidationError from "../Errors/validationError";

interface Option {
  id: string;
  name: string;
}

interface MultiSelectProps {
  name: string;
  label: string;
  options: Option[];
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  saveAsId?: boolean; // save value as ID instead of name
}

export const MultiSelectInput = ({
  name,
  label,
  options,
  register,
  errors,
  required = false,
  disabled = false,
  className = "",
  saveAsId = true,
}: MultiSelectProps) => {
  return (
    <div className={`w-full ${className}`}>
      <Label name={name} id={name} label={label} required={required} />
      <select
        id={name}
        multiple
        {...register(name, {
          required,
          setValueAs: (value) => {
            if (!value) return [];
            return Array.isArray(value) ? value : [value];
          },
        })}
        disabled={disabled}
        className={`mt-1 block w-full rounded-[30px] border p-4 px-5 ring-black-400 focus-within:ring-1 ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        }`}
      >
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
