"use client";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ValidationError from "../Errors/validationError";
import { FieldErrors, Controller } from "react-hook-form";
import Label from "./Label";

interface Props extends React.HTMLAttributes<HTMLInputElement> {
  name: string;
  required?: boolean;
  errors: FieldErrors<any>;
  control: any; // react-hook-form control object required for Controller
  label: string;
  placeholder?: string;
}

// Calculate max and min dates
const today = new Date();
const maxDate = new Date(
  today.getFullYear() - 6,
  today.getMonth(),
  today.getDate()
);
const minDate = new Date(
  maxDate.getFullYear() - 100,
  maxDate.getMonth(),
  maxDate.getDate()
);

export default function DateInput({
  name,
  label,
  errors,
  control,
  placeholder,
  required,
}: Props) {
  return (
    <div className="w-full">
      <Label label={label} required={required} name={name} />
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <DatePicker
            className="w-full rounded-lg border border-[#CCCCCC] bg-white p-2 text-black"
            placeholderText={placeholder}
            selected={field.value ? new Date(field.value) : null}
            onChange={(date: Date | null) => {
              // Pass the Date object directly - Zod will handle it
              field.onChange(date);
            }}
            maxDate={maxDate}
            minDate={minDate}
            dateFormat="dd-MM-yyyy"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        )}
      />
      <div className="min-h-5">
        <ValidationError errors={errors} name={name} />
      </div>
    </div>
  );
}
