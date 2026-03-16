import ValidationError from "@/components/errors/validationError";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface Props {
  value?: File | null;
  onChange: (file: File | null) => void;
  errors: any;
}

export default function Imageinput({ value, onChange, errors }: Props) {
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (value instanceof File) {
      setImgUrl(URL.createObjectURL(value));
    } else {
      setImgUrl(null);
    }
  }, [value]);

  function addphoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    if (!file) return;
    onChange(file);
  }

  function clearphoto() {
    onChange(null);
  }

  return (
    <figure className="mb-4 w-full flex-col items-center justify-center gap-4">
      <label
        htmlFor="dropzone-file"
        className="flex h-auto w-full cursor-pointer flex-col items-center overflow-hidden justify-center rounded-2xl border-4 border-dashed border-gray-200 bg-white hover:bg-gray-100 py-8"
      >
        {imgUrl ? (
          <div className="relative  w-full flex justify-center items-center">
            <Image
              src={imgUrl}
              alt="preview"
              width={260}
              height={260}
              className="rounded-lg object-cover "
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                clearphoto();
              }}
              className="absolute top-2 right-2 rounded-lg bg-red-600 px-2 py-1 text-white"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-6">
            <Image
              src="/icons/image.svg"
              alt="coupon"
              width={100}
              height={100}
              className="relative"
            />
            <div className="px-3.5 text-center">
              <p className="mb-2 text-xl font-bold">رفع إيصال الدفع</p>
              <p className="text-md text-Charcoal-Gray text-center">
                من فضلك قم برفع صورة واضحة لإيصال الدفع الخاص بك لتأكيد العملية
              </p>
            </div>
          </div>
        )}

        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={addphoto}
          accept="image/*"
        />
      </label>
      <div className="min-h-5">
        <ValidationError errors={errors} name="image" />
      </div>
    </figure>
  );
}
