"use client";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import Label from "./Label";
import ValidationError from "../Errors/validationError";

interface Props {
  label: string;
  required?: boolean;
  options: string[];
  name: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export default function RadioGroup({
  label,
  required,
  options,
  name,
  register,
  errors,
}: Props) {
  return (
    <div className="space-y-2">
      <Label name={name} label={label} required={required} id={name} />
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
                required: required ? "This field is required" : false,
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
