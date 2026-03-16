"use client";
import {
  useFieldArray,
  Control,
  FieldErrors,
  UseFormSetValue,
  UseFormRegister,
} from "react-hook-form";
import { SelectInput } from "./SelectInput";
import TextInput from "./TextInput";
import ValidationError from "../errors/validationError";
import { ProjectFormData } from "@/services/validations/project";
import Label from "./Label";

interface EmployeeOption {
  id: string;
  name: string;
}

interface EmployeeArrayInputProps {
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  setValue: UseFormSetValue<any>;
  employees: EmployeeOption[] | undefined;
  name?: string;
  label: string;
  required?: boolean;
}

const CURRENCY_OPTIONS = [
  { id: "EGP", name: "EGP" },
  { id: "SAR", name: "SAR" },
  { id: "AED", name: "AED" },
  { id: "USD", name: "USD" },
  { id: "EUR", name: "EUR" },
];

export const EmployeeArrayInput = ({
  control,
  register,
  errors,
  employees,
  name = "employees",
  label,
  required,
  setValue,
}: EmployeeArrayInputProps) => {
  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: name as never,
  });

  // Function to set initial values from modal
  const setInitialEmployees = (initialData: any[]) => {
    if (initialData?.length) {
      replace(initialData); // THIS is key!
    }
  };

  const addEmployee = () => {
    append({
      employee: "",
      compensation: 0,
      currency: "EGP",
    });
  };

  const removeEmployee = (index: number) => {
    if (fields.length > 1) remove(index);
  };

  return (
    <div className="w-full space-y-4 mt-6">
      <div className="flex items-center justify-between">
        <Label label={label} name={name} required={required} id={name} />
        <button
          type="button"
          onClick={addEmployee}
          className="flex items-center gap-2  bg-primary  rounded-4xl hover:bg-primary/90 ] bg-linear-to-r from-[#DE4646] to-[#B72D2D] px-4 py-2 transition-all   ease-in-out duration-700 font-noor-bold text-white hover:bg-linear-to-l hover:from-[#B72D2D] hover:to-[#DE4646] "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Employee
        </button>
      </div>

      {/* Employee List */}
      <div className="space-y-6">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="relative p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
          >
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => removeEmployee(index)}
                className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 12H4"
                  />
                </svg>
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SelectInput
                name={`employees.${index}.employee` as any}
                label="Employee"
                options={employees}
                register={register}
                setValue={setValue}
                errors={errors}
                control={control}
                required
                placeholder="Select employee"
                saveAsId
              />

              <TextInput
                name={`employees.${index}.compensation` as any}
                label="Salary"
                register={register}
                errors={errors}
                required
                placeholder="0"
                numbersOnly
              />

              <SelectInput
                name={`employees.${index}.currency` as any}
                label="Currency"
                options={CURRENCY_OPTIONS}
                register={register}
                setValue={setValue}
                errors={errors}
                required
                placeholder="Select currency"
                saveAsId={false}
                control={control}
              />
            </div>
          </div>
        ))}
      </div>

      {errors.employees && typeof errors.employees.message === "string" && (
        <ValidationError errors={errors} name="employees" />
      )}
    </div>
  );
};
