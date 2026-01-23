"use client";
import {
  useFieldArray,
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import ValidationError from "@/components/Errors/validationError";
import Label from "./Label";

interface Props {
  name: string;
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export const MultiPhonesInput = ({
  name,
  control,
  register,
  errors,
}: Props) => {
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="space-y-2">
      <Label name={name} label="Phones" required />
      {fields.map((f, idx) => (
        <div key={f.id} className="flex gap-2">
          <input
            type="tel"
            {...register(`${name}.${idx}`)}
            className="flex-1 border rounded px-3 py-2"
            placeholder="+123456789012"
          />
          {fields.length > 1 && (
            <button
              type="button"
              onClick={() => remove(idx)}
              className="text-red-600"
            >
              Remove
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => append("")}
        className="text-sm text-blue-600"
      >
        + Add phone
      </button>
      <ValidationError errors={errors} name={name} />
    </div>
  );
};
