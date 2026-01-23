"use client";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
  UseFormTrigger,
} from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import ValidationError from "@/components/Errors/validationError";
import Label from "./Label";

interface Props {
  name: string;
  label: string;
  required?: boolean;
  placeHolder?: string;
  options: Option[];
  register: UseFormRegister<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
  disabled?: boolean;
  defaultValue?: any[];
  className?: string;
  trigger?: UseFormTrigger<any>;
  /** choose whether to store "id" or "enName" */
  saveAs?: "id" | "enName" | "arName";
}

interface Options {
  id: number;
  name: string;
}

interface Option {
  id: string;
  name: string;
}
export default function MultiSelect({
  label,
  name,
  options,
  required,
  placeHolder,
  errors,
  register,
  setValue,
  disabled = false,
  defaultValue = [],
  saveAs = "id",
}: Props) {
  const [selectedItems, setSelectedItems] = useState<any[]>(defaultValue);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Register field on mount
  useEffect(() => {
    register(name, { required });
  }, [name, register, required]);

  // Keep form state updated
  useEffect(() => {
    setValue(name, selectedItems);
  }, [selectedItems, name, setValue]);

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

  const handleToggleOption = (option: Option) => {
    if (disabled) return;

    const valueToSave = saveAs === "id" ? option.id : option.name;
    setSelectedItems((prev) =>
      prev.includes(valueToSave)
        ? prev.filter((item) => item !== valueToSave)
        : [...prev, valueToSave]
    );
  };

  const handleRemoveOption = (value: any) => {
    if (disabled) return;
    setSelectedItems((prev) => prev.filter((item) => item !== value));
  };

  const isSelected = (option: Option) => {
    const valueToSave = saveAs === "id" ? option.id : option.name;
    return selectedItems.includes(valueToSave);
  };

  const getSelectedOptions = () =>
    options?.filter((option) => isSelected(option));

  const getAvailableOptions = () =>
    options?.filter((option) => !isSelected(option));

  return (
    <div className="w-full" ref={containerRef}>
      <Label label={label} required={required} name={name} />

      <div className="relative w-full">
        {/* Selected Items Display */}
        <div
          className={`w-full rounded-lg border border-[#CCCCCC] bg-white p-2 ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
          } ${selectedItems.length === 0 ? "min-h-10.5" : "min-h-10.5"}`}
          onClick={() => !disabled && setIsOpen(!isOpen)}
        >
          {selectedItems.length === 0 ? (
            <span className="text-gray-400">{`--${
              placeHolder ?? "Select"
            }--`}</span>
          ) : (
            <div className="flex flex-wrap gap-2">
              {getSelectedOptions()?.map((option) => (
                <div
                  key={option.id}
                  className="bg-secondary flex items-center gap-2 rounded-md px-3 py-1 text-sm text-white"
                >
                  <span>{option.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      const val = saveAs === "id" ? option.id : option.name;
                      handleRemoveOption(val);
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
          <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-[#CCCCCC] bg-white shadow-lg">
            {getAvailableOptions().length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                no Available Options
              </div>
            ) : (
              getAvailableOptions().map((option) => (
                <div
                  key={option.id}
                  className="hover:bg-secondary/10 cursor-pointer p-3 transition-colors"
                  onClick={() => handleToggleOption(option)}
                >
                  {option.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="min-h-5">
        <ValidationError errors={errors} name={name} />
      </div>
    </div>
  );
}
