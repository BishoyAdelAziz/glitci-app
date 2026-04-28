"use client";

import {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
  UseFormSetValue,
  Control,
  useWatch,
} from "react-hook-form";
import Label from "./Label";
import ValidationError from "../errors/validationError";

interface DateTimeInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
  name: TName;
  label: string;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  control: Control<TFieldValues>;
  required?: boolean;
  placeholder?: string;
  className?: string;
  min?: string;
}

export default function DateTimeInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  name,
  label,
  register,
  errors,
  setValue,
  control,
  required = false,
  placeholder = "Select date & time",
  className = "",
  min,
}: DateTimeInputProps<TFieldValues, TName>) {
  const currentValue = useWatch({ control, name });

  return (
    <div className={`w-full ${className}`}>
      <Label label={label} name={String(name)} required={required} />
      <div className="relative mt-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path
              strokeLinecap="round"
              strokeWidth="2"
              d="M12 6v6l4 2"
            />
          </svg>
        </div>
        <input
          type="datetime-local"
          className={`w-full rounded-lg p-3 pl-10 bg-[#EEEEEE] dark:bg-gray-900 dark:ring-1 dark:ring-gray-400 outline-none text-sm transition-colors ${
            errors[name as any]?.message
              ? "ring-2 ring-red-400"
              : ""
          } ${!currentValue ? "text-gray-400" : ""}`}
          {...register(name)}
          min={min}
        />
      </div>
      <div className="min-h-5">
        <ValidationError errors={errors} name={String(name)} />
      </div>
    </div>
  );
}
