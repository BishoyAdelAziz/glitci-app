"use client";
import ValidationError from "../errors/validationError";
import {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import Label from "./Label";

interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "name" | "onInput"
> {
  label: string;
  placeholder?: string;
  required?: boolean;
  name: TName;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  type?: string;
  numbersOnly?: boolean;
  textOnly?: boolean;
  valueAsNumber?: boolean;
  step?: string;
}

export default function TextInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  label,
  name,
  errors,
  type = "text",
  placeholder,
  register,
  required,
  numbersOnly = false,
  textOnly = false,
  valueAsNumber = false,
  step,
  className,
  onChange,
  ...rest
}: Props<TFieldValues, TName>) {
  // Input handler to enforce numbersOnly or textOnly constraints
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let filteredValue = e.target.value;

    if (numbersOnly) {
      // Allow only digits 0-9
      filteredValue = filteredValue.replace(/[^0-9]/g, "");
    } else if (textOnly) {
      // Allow only letters (a-z, case insensitive), Arabic, and spaces
      filteredValue = filteredValue.replace(
        /[^a-zA-Z\u0600-\u06FF\s\/\\-]/g,
        "",
      );
    }

    if (filteredValue !== e.target.value) {
      e.target.value = filteredValue;
    }

    // Call React Hook Form's onChange (from register)
    if (onChange) {
      onChange(e as any);
    }
  };

  return (
    <div className="w-full">
      <Label label={label} name={String(name)} required={required} />
      <input
        type={type}
        className={`focus:border-secondary w-full rounded-lg p-3  bg-[#EEEEEE]  outline-none placeholder:text-xs placeholder:opacity-35 transition-colors ${
          errors[name as any]?.message ? "border-red-500" : ""
        } ${className || ""}`}
        {...register(name, {
          required: required ? "Required" : false,
          valueAsNumber,
        })}
        placeholder={placeholder}
        onInput={handleInput}
        step={step}
        {...rest}
      />
      <div className="min-h-5">
        <ValidationError errors={errors} name={name} />
      </div>
    </div>
  );
}
