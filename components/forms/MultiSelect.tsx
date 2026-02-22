"use client";

import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
} from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import ValidationError from "../errors/validationError";
import Label from "./Label";

interface Option {
  id: string;
  name: string;
}

interface Props<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
> {
  name: TName;
  label: string;
  control: Control<TFieldValues>;
  errors: FieldErrors<TFieldValues>;
  options?: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  saveAsId?: boolean;
  className?: string;
}

export function MultiSelect<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>,
>({
  name,
  label,
  control,
  errors,
  options = [],
  placeholder = "Select",
  required,
  disabled = false,
  saveAsId = true,
  className = "",
}: Props<TFieldValues, TName>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      <Label label={label} required={required} name={String(name)} />

      <Controller
        name={name}
        control={control}
        rules={{ required: required ? "هذا الحقل مطلوب" : false }}
        render={({ field: { value, onChange } }) => {
          /** ✅ ALWAYS ARRAY */
          const selectedValues: string[] = Array.isArray(value) ? value : [];

          /** 🔥 Remove invalid IDs when options change */
          useEffect(() => {
            const validIds = options.map((opt) =>
              saveAsId ? opt.id : opt.name,
            );

            const filtered = selectedValues.filter((v) => validIds.includes(v));

            if (filtered.length !== selectedValues.length) {
              onChange(filtered);
            }
          }, [options]);

          const selectedOptions = options.filter((opt) =>
            selectedValues.includes(saveAsId ? opt.id : opt.name),
          );

          const availableOptions = options.filter(
            (opt) => !selectedValues.includes(saveAsId ? opt.id : opt.name),
          );

          return (
            <div className="relative w-full">
              {/* Input */}
              <div
                onClick={() => !disabled && setIsOpen((p) => !p)}
                className={`min-h-10.5 w-full rounded-lg border border-[#CCCCCC] bg-white dark:bg-gray-900 p-2 transition-colors ${
                  disabled
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer hover:border-secondary"
                }`}
              >
                {selectedOptions.length === 0 ? (
                  <span className="text-gray-400">{`--${placeholder}--`}</span>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {selectedOptions.map((opt) => {
                      const val = saveAsId ? opt.id : opt.name;

                      return (
                        <span
                          key={opt.id}
                          className="flex items-center gap-2 rounded-md bg-secondary px-3 py-1 text-sm dark:text-white "
                        >
                          {opt.name}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onChange(selectedValues.filter((v) => v !== val));
                            }}
                            className="hover:text-red-300"
                          >
                            ✕
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Dropdown */}
              {isOpen && !disabled && (
                <div className="absolute z-20 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-[#CCCCCC] bg-white dark:bg-gray-900 shadow-lg">
                  {availableOptions.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No available options
                    </div>
                  ) : (
                    availableOptions.map((opt) => {
                      const val = saveAsId ? opt.id : opt.name;

                      return (
                        <div
                          key={opt.id}
                          onClick={() => onChange([...selectedValues, val])}
                          className="cursor-pointer border-b border-gray-100 p-3 last:border-b-0 hover:bg-secondary/10 dark:hover:bg-gray-700"
                        >
                          {opt.name}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        }}
      />

      <div className="min-h-5">
        <ValidationError errors={errors} name={name} />
      </div>
    </div>
  );
}
