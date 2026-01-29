"use client";
import {
  UseFormRegister,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import Label from "./Label";
import ValidationError from "../errors/validationError";

interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
  label: string;
  required?: boolean;
  options: string[];
  name: TName; // Typed to valid form field paths
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
}

export default function RadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  label,
  required,
  options,
  name,
  register,
  errors,
}: Props<TFieldValues, TName>) {
  return (
    <div className="space-y-2">
      <Label
        name={String(name)}
        label={label}
        required={required}
        id={String(name)}
      />
      <div className="flex gap-4 flex-wrap">
        {options.map((option) => (
          <label
            key={option}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              value={option}
              {...register(name, {
                required: required ? "هذا الحقل مطلوب" : false,
              })}
              className="accent-primary"
            />
            <span>{option}</span>
          </label>
        ))}
      </div>
      <ValidationError errors={errors} name={name} />
    </div>
  );
}
