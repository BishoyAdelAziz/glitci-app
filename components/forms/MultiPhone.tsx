"use client";
import {
  useFieldArray,
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import ValidationError from "../errors/validationError";
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
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    keyName: "fieldId",
  });

  // Handle keypress to allow only + and numbers
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.ctrlKey || e.metaKey) {
      return;
    }

    const char = e.key;
    const isNumber = /^[0-9]$/.test(char);
    const isPlus = char === "+";
    const isControlKey = [
      "Backspace",
      "Delete",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Home",
      "End",
      "Tab",
      "Enter",
      "Escape",
    ].includes(char);

    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;

    if (isPlus && cursorPosition !== 0) {
      e.preventDefault();
      return;
    }

    if (!isNumber && !isPlus && !isControlKey) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");

    const cleaned = pastedText.replace(/[^0-9+]/g, "");
    const formatted = cleaned.startsWith("+")
      ? "+" + cleaned.slice(1).replace(/\+/g, "")
      : cleaned.replace(/\+/g, "");

    const input = e.currentTarget;
    const cursorPosition = input.selectionStart || 0;
    const currentValue = input.value;

    const newValue =
      currentValue.slice(0, cursorPosition) +
      formatted +
      currentValue.slice(input.selectionEnd || cursorPosition);

    input.value = newValue;

    const event = new Event("input", { bubbles: true });
    input.dispatchEvent(event);
  };

  // Get the array-level error (if any)
  const arrayError = errors[name];

  return (
    <div className="space-y-2">
      {/* Label and Add Button on same line */}
      <div className="flex items-center justify-between">
        <Label name={name} label="Phones" required />
        <button
          type="button"
          onClick={() => append("")}
          className="flex items-center gap-2 bg-primary rounded-4xl hover:bg-primary/90 bg-linear-to-r from-[#DE4646] to-[#B72D2D] px-4 py-2 transition-all ease-in-out duration-700 font-noor-bold text-white hover:bg-linear-to-l hover:from-[#B72D2D] hover:to-[#DE4646]"
        >
          + Add phone
        </button>
      </div>

      {/* Phone inputs */}
      <div className="space-y-2">
        {fields.map((field, idx) => (
          <div key={field.fieldId} className="space-y-1">
            <div className="flex gap-2 items-center">
              <input
                type="tel"
                {...register(`${name}.${idx}`)}
                onKeyDown={handleKeyPress}
                onPaste={handlePaste}
                className={`flex-1 border rounded px-3 py-2 ${
                  errors[name]?.[idx] ? "border-red-500" : ""
                }`}
                placeholder="+123456789012"
              />
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(idx)}
                  className="text-red-600 hover:text-red-700 p-2"
                  aria-label="Remove phone"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>
            {/* Show individual phone error */}
            {errors[name]?.[idx]?.message && (
              <p className="text-red-500 text-xs">
                {errors[name][idx].message as string}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Show array-level error (e.g., "at least one number required") */}
      {arrayError?.message && typeof arrayError.message === "string" && (
        <p className="text-red-500 text-xs">{arrayError.message}</p>
      )}
    </div>
  );
};
