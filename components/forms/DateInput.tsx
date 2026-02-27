"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Controller, FieldErrors } from "react-hook-form";
import Label from "./Label";
import ValidationError from "../errors/validationError";

interface Props {
  name: string;
  label: string;
  control: any;
  errors: FieldErrors<any>;
  required?: boolean;
  placeholder?: string;
}

export default function DateInput({
  name,
  label,
  control,
  errors,
  required,
  placeholder,
}: Props) {
  return (
    <div className="w-full gap-1 flex flex-col items-start justify-between">
      <Label label={label} name={name} required={required} />

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            placeholderText={placeholder}
            selected={field.value ? new Date(field.value) : null}
            onChange={(date: Date | null) => {
              field.onChange(date ? date.toISOString().split("T")[0] : "");
            }}
            dateFormat="dd-MM-yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            className="
              w-full rounded-lg border p-3  text-sm
              bg-white text-black border-gray-300
              dark:bg-gray-900 dark:text-white dark:border-gray-600
              focus:outline-none focus:ring-1 focus:ring-primary
            "
            calendarClassName="dark:bg-gray-800 dark:text-white"
          />
        )}
      />

      <div className="min-h-5">
        <ValidationError errors={errors} name={name} />
      </div>
    </div>
  );
}
