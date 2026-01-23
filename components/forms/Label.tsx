"use client";
interface Props {
  name: string;
  label: string;
  required?: boolean;
  id?: string;
}

export default function Label({ name, label, required, id }: Props) {
  return (
    <label
      className="inline-flex items-center justify-center gap-1 font-bold text-black"
      htmlFor={`${name}`}
      id={id}
    >
      {label}
      {required ? (
        <span className="text-lg font-bold text-red-600">*</span>
      ) : (
        <p className="inline text-sm font-light text-gray-500">(optional)</p>
      )}
    </label>
  );
}
