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
import { useState, useRef, useEffect } from "react";
import Label from "./Label";
import ValidationError from "../errors/validationError";

interface Option {
  id: string;
  name: string;
}

interface SelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
> {
  name: TName;
  label: string;
  options: Option[] | undefined;
  register: UseFormRegister<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
  control: Control<TFieldValues>;

  required?: boolean; // Only for visual * indicator
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  saveAsId?: boolean;
}

export const SelectInput = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends Path<TFieldValues> = Path<TFieldValues>,
>({
  name,
  label,
  options,
  register,
  errors,
  required = false,
  disabled = false,
  placeholder = "Select an option",
  className = "",
  saveAsId = true,
  setValue,
  control,
}: SelectProps<TFieldValues, TName>) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<"down" | "up">(
    "down",
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Watch the current form value
  const currentValue = useWatch({ control, name });

  // Sync selectedOption with form value (handles setValue calls)
  useEffect(() => {
    if (currentValue && options) {
      const option = options.find((opt) =>
        saveAsId ? opt.id === currentValue : opt.name === currentValue,
      );
      setSelectedOption(option || null);
    } else {
      setSelectedOption(null);
    }
  }, [currentValue, options, saveAsId]);

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

  // Calculate dropdown position based on available space
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const dropdownHeight = 240; // max-h-60 = 240px
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Open upward if not enough space below but enough space above
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownPosition("up");
      } else {
        setDropdownPosition("down");
      }
    }
  }, [isOpen]);

  // Handle option selection
  const handleSelectOption = (option: Option) => {
    const value = saveAsId ? option.id : option.name;

    setSelectedOption(option);
    setIsOpen(false);

    setValue(name, value as any, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  // Hidden native select - NO required validation here (Zod handles it)
  const registerSelect = register(name, {
    // No required rule here - let Zod handle validation
  });

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      <Label
        name={String(name)}
        id={String(name)}
        label={label}
        required={required} // Only for visual * indicator
      />
      {/* Custom Select Display */}
      <div className="relative">
        {/* Hidden native select for form - NO validation rules */}
        <select
          id={String(name)}
          className="sr-only"
          {...registerSelect}
          disabled={disabled}
        >
          <option value="">{placeholder}</option>
          {options?.map((option) => (
            <option key={option.id} value={saveAsId ? option.id : option.name}>
              {option.name}
            </option>
          ))}
        </select>

        {/* Custom Styled Select */}
        <div
          className={`mt-1 block w-full bg-white dark:bg-gray-900  border p-4 px-5 ring-black-400 dark:ring-white/30 cursor-pointer transition-all flex items-center justify-between min-h-[56px] ${
            disabled
              ? "bg-gray-100 cursor-not-allowed"
              : "bg-white dark:bg-gray-900 hover:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:border-primary"
          } ${errors[name as any]?.message ? "border-red-500 ring-red-200" : "border-[#CFCFCF] dark:border-gray-500"} ${className}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          tabIndex={disabled ? -1 : 0}
        >
          {selectedOption ? (
            <span className="text-sm font-medium">{selectedOption.name}</span>
          ) : (
            <span className="text-sm text-gray-500">{placeholder}</span>
          )}
          <svg
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {/* Custom Dropdown */}
        {isOpen && !disabled && (
          <div
            ref={dropdownRef}
            className={`absolute z-20 w-full max-h-60 overflow-y-auto border border-[#CFCFCF] bg-white dark:bg-gray-600 shadow-xl ${
              dropdownPosition === "up" ? "bottom-full mb-1" : "top-full mt-1"
            }`}
          >
            {options?.map((option) => (
              <div
                key={option.id}
                className="px-5 py-3 cursor-pointer dark:hover:bg-gray-400 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm"
                onClick={() => handleSelectOption(option)}
              >
                {option.name}
              </div>
            ))}
          </div>
        )}
      </div>
      <ValidationError errors={errors} name={name} />{" "}
      {/* Zod validation message */}
    </div>
  );
};
