"use client";
import {
  Controller,
  Control,
  FieldErrors,
  FieldPath,
  FieldValues,
  Path,
} from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import ValidationError from "../errors/validationError";
import Label from "./Label";

interface Option {
  id: string;
  name: string;
}

interface Props<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
  name: TName;
  label: string;
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  options: Option[] | undefined;
  required?: boolean;
  placeHolder?: string;
  disabled?: boolean;
  saveAs?: "id" | "name";
  className?: string;
}

export default function MultiSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  name,
  label,
  control,
  errors,
  options,
  required,
  placeHolder,
  disabled = false,
  saveAs = "id",
  className = "",
}: Props<TFieldValues, TName>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSelectedOptions = (selectedValues: string[]) =>
    options?.filter((option) => {
      const valueToSave = saveAs === "id" ? option.id : option.name;
      return selectedValues.includes(valueToSave);
    });

  const getAvailableOptions = (selectedValues: string[]) =>
    options?.filter((option) => {
      const valueToSave = saveAs === "id" ? option.id : option.name;
      return !selectedValues.includes(valueToSave);
    });

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      <Label label={label} required={required} name={String(name)} />

      <Controller
        control={control}
        name={name}
        rules={{ required: required ? "هذا الحقل مطلوب" : false }}
        render={({ field: { value = [] as string[], onChange } }) => (
          <div className="relative w-full">
            {/* Selected Items Display */}
            <div
              className={`w-full rounded-lg border border-[#CCCCCC] bg-white dark:bg-gray-900 p-2 transition-colors ${
                disabled
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:border-secondary"
              } ${value.length === 0 ? "min-h-10.5" : "min-h-10.5"}`}
              onClick={() => !disabled && setIsOpen((prev) => !prev)}
            >
              {value.length === 0 ? (
                <span className="text-gray-400">
                  {`--${placeHolder ?? "Select"}--`}
                </span>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {getSelectedOptions(value)?.map((option) => (
                    <div
                      key={option.id}
                      className="bg-secondary dark:bg-gray-900 flex items-center gap-2 rounded-md px-3 py-1 text-sm dark:text-white"
                    >
                      <span>{option.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          const val = saveAs === "id" ? option.id : option.name;
                          onChange(value.filter((item) => item !== val));
                        }}
                        className="hover:text-red-300"
                        disabled={disabled}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dropdown Options */}
            {isOpen && !disabled && (
              <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-[#CCCCCC] bg-white dark:bg-gray-900 shadow-lg">
                {getAvailableOptions(value)?.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No Available Options
                  </div>
                ) : (
                  getAvailableOptions(value)?.map((option) => (
                    <div
                      key={option.id}
                      className="hover:bg-secondary/10 cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-50 p-3 transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={() => {
                        const val = saveAs === "id" ? option.id : option.name;
                        const isSelected = value.includes(val);
                        onChange(
                          isSelected
                            ? value.filter((item) => item !== val)
                            : [...value, val],
                        );
                        // setIsOpen(false); // Close after selection
                      }}
                    >
                      {option.name}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      />

      <div className="min-h-5">
        <ValidationError errors={errors} name={name} />
      </div>
    </div>
  );
}
