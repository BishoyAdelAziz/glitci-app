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
import { useState, useRef, useEffect, useLayoutEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Label from "./Label";
import ValidationError from "../errors/validationError";

interface Option {
  id?: string;
  name?: string;
}

interface DropdownRect {
  top: number;
  left: number;
  width: number;
  openUpward: boolean;
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

  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  saveAsId?: boolean;
}

// ─── Portal Dropdown ────────────────────────────────────────────────────────
interface PortalDropdownProps {
  rect: DropdownRect;
  options: Option[] | undefined;
  selectedOption: Option | null;
  onSelect: (option: Option) => void;
}

const DROPDOWN_MAX_HEIGHT = 240; // px — matches max-h-60

const PortalDropdown = ({ rect, options, onSelect }: PortalDropdownProps) => {
  const style: React.CSSProperties = {
    position: "fixed",
    zIndex: 2147483647, // Maximum possible z-index
    width: rect.width,
    left: rect.left,
    maxHeight: DROPDOWN_MAX_HEIGHT,
    overflowY: "auto",
    ...(rect.openUpward
      ? { bottom: window.innerHeight - rect.top }
      : { top: rect.top }),
  };

  return createPortal(
    <div
      style={style}
      className="border border-[#CFCFCF] bg-white dark:bg-gray-600 shadow-xl rounded-b-lg"
    >
      {options?.map((option) => (
        <div
          key={option.id}
          className="px-5 py-3 cursor-pointer dark:hover:bg-gray-400 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 text-sm"
          onMouseDown={(e) => {
            // Use onMouseDown + preventDefault so the trigger's onBlur
            // doesn't fire and close the dropdown before onClick registers.
            e.preventDefault();
            onSelect(option);
          }}
        >
          {option.name}
        </div>
      ))}
    </div>,
    document.body,
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
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
  const [dropdownRect, setDropdownRect] = useState<DropdownRect>({
    top: 0,
    left: 0,
    width: 0,
    openUpward: false,
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Watch the current form value
  const currentValue = useWatch({ control, name });

  // Sync selectedOption with form value
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

  // ── Calculate and sync dropdown position ──────────────────────────────────
  const updateRect = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward =
      spaceBelow < DROPDOWN_MAX_HEIGHT && spaceAbove > spaceBelow;

    setDropdownRect({
      top: openUpward ? rect.top : rect.bottom + 1,
      left: rect.left,
      width: rect.width,
      openUpward,
    });
  }, []);

  // Recalculate on open
  useLayoutEffect(() => {
    if (isOpen) updateRect();
  }, [isOpen, updateRect]);

  // Track scroll and resize while open — attach to ALL scrollable ancestors
  useEffect(() => {
    if (!isOpen) return;

    // Collect every scrollable ancestor so we track nested scroll containers
    const scrollableAncestors: Array<HTMLElement | Window> = [window];
    let el = containerRef.current?.parentElement;
    while (el) {
      const { overflow, overflowY } = getComputedStyle(el);
      if (/auto|scroll/.test(overflow + overflowY)) {
        scrollableAncestors.push(el);
      }
      el = el.parentElement;
    }

    scrollableAncestors.forEach((target) =>
      target.addEventListener("scroll", updateRect, { passive: true }),
    );
    window.addEventListener("resize", updateRect, { passive: true });

    return () => {
      scrollableAncestors.forEach((target) =>
        target.removeEventListener("scroll", updateRect),
      );
      window.removeEventListener("resize", updateRect);
    };
  }, [isOpen, updateRect]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const registerSelect = register(name);

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      <Label
        name={String(name)}
        id={String(name)}
        label={label}
        required={required}
      />

      <div className="relative">
        {/* Hidden native select for form */}
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

        {/* Styled trigger */}
        <div
          className={`mt-1 w-full bg-white dark:bg-gray-900 rounded-lg border p-3 ring-black-400 dark:ring-white/30 cursor-pointer transition-all flex items-center justify-between
            ${
              disabled
                ? "bg-gray-100 cursor-not-allowed"
                : "bg-white dark:bg-gray-900 hover:border-primary focus-within:ring-1 focus-within:ring-primary focus-within:border-primary"
            }
            ${
              errors[name as any]?.message
                ? "border-red-500 ring-red-200"
                : "border-[#CFCFCF] dark:border-gray-500"
            }
            ${className}`}
          onClick={() => {
            if (!disabled) setIsOpen((prev) => !prev);
          }}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (!disabled && (e.key === "Enter" || e.key === " ")) {
              e.preventDefault();
              setIsOpen((prev) => !prev);
            }
            if (e.key === "Escape") setIsOpen(false);
          }}
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

        {/* Portal dropdown — rendered into document.body, tracks scroll */}
        {isOpen && !disabled && (
          <PortalDropdown
            rect={dropdownRect}
            options={options}
            selectedOption={selectedOption}
            onSelect={handleSelectOption}
          />
        )}
      </div>

      <ValidationError errors={errors} name={name} />
    </div>
  );
};