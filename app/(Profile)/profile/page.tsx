"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ImageCropper from "@/components/forms/ImageCropper";
import useUser from "@/hooks/useUser";
import { CameraIcon, UserIcon } from "@/components/ui/svg";
import { useForm } from "react-hook-form";
import TextInput from "@/components/forms/TextInput";
import { SelectInput } from "@/components/forms/SelectInput";
import { MultiSelect } from "@/components/forms/MultiSelect";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  UpdateUserSchema,
  UpdateUserSchemaFormFilds,
} from "@/services/validations/user";
import usePositions from "@/hooks/usePositions";
import useSkills from "@/hooks/useSkills";

// ─── Info Row ─────────────────────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-4 border-b border-gray-100 last:border-0">
      <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold w-28 shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-sm font-medium text-gray-800 text-right">
        {value}
      </span>
    </div>
  );
}

export default function ProfilePage() {
  const { user, UpdateMeMutation, UpdateMeMutationIsPending } = useUser();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    reset, // Added reset for initialization
  } = useForm<UpdateUserSchemaFormFilds>({
    reValidateMode: "onChange",
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user?.name || "",
      phone: user?.phone || "",
      email: user?.email || "",
      currency: user?.currency || "EGP",
    },
  });

  // Sync form with user data when it changes/loads
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        phone: user.phone,
        email: user.email,
        currency: user.currency,
      });
    }
  }, [user, reset]);

  const Position = watch("position");
  const { positions } = usePositions({ limit: 1000 });
  const { Skills } = useSkills({ position: Position });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onCropComplete = (base64: string) => {
    fetch(base64)
      .then((res) => res.blob())
      .then((blob) => {
        const formData = new FormData();
        formData.append("image", blob, "profile.jpg");
        UpdateMeMutation(formData as any);
        setSelectedImage(null);
      });
  };

  const onSubmit = (data: UpdateUserSchemaFormFilds) => {
    // 1. Destructure to omit specific fields for formatting
    const { skills, position, ...rest } = data;
    const formattedData: Record<string, any> = { ...rest };

    // 2. Map skills to skill[0], skill[1] format
    if (Array.isArray(skills)) {
      skills.forEach((skill: any, index: number) => {
        const skillValue = typeof skill === "object" ? skill.name : skill;
        formattedData[`skill[${index}]`] = skillValue;
      });
    }

    console.log("Formatted Submission:", formattedData);
    UpdateMeMutation(formattedData as any);
  };

  // UI mapping logic
  const staticSkills = ["React", "Next.js", "Node.js", "Tailwind CSS"];
  const refinedPositions =
    positions?.map((pos) => ({
      id: pos.id,
      name: pos.name,
    })) || [];

  const refinedSkills =
    Skills?.data.map((skill) => ({
      id: skill.id,
      name: skill.name,
    })) || [];

  return (
    <div
      className="pb-12"
      style={{
        background: "linear-gradient(160deg, #faf9f7 0%, #f3f0eb 100%)",
      }}
    >
      <div className="relative h-56 w-full overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, #DE4646 0%, #9B1B1B 60%, #6B0F0F 100%)",
          }}
        />
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full opacity-10 border-40 border-white" />
        <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-10 border-24 border-white" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg,transparent,transparent 39px,#fff 39px,#fff 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,#fff 39px,#fff 40px)",
          }}
        />
      </div>

      <div className="container mx-auto px-4 lg:px-12">
        <div className="relative -mt-20 flex flex-col items-center">
          <div className="relative z-10">
            <div
              className="absolute inset-0 rounded-full blur-md opacity-30"
              style={{
                background: "linear-gradient(135deg,#DE4646,#9B1B1B)",
                transform: "scale(1.15)",
              }}
            />
            <div className="relative h-36 w-36 rounded-full border-[3px] border-white shadow-xl overflow-hidden bg-white">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt="Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                  <UserIcon className="h-14 w-14 text-gray-400" />
                </div>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={UpdateMeMutationIsPending}
              className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#DE4646] text-white shadow-md transition-transform hover:scale-110 disabled:opacity-60"
            >
              <CameraIcon className="h-4 w-4" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="mt-4 text-center space-y-2">
            <h1 className="text-3xl font-bold capitalize text-gray-900 tracking-tight">
              {user?.name ?? "Your Name"}
            </h1>
            <span
              className="inline-block px-4 py-1 rounded-full text-xs font-bold uppercase tracking-[0.15em] text-white"
              style={{ background: "linear-gradient(90deg,#DE4646,#B72D2D)" }}
            >
              {user?.role ?? "Role"}
            </span>
          </div>

          <div className="mt-8">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 rounded-xl border-2 border-gray-900 text-sm font-bold uppercase tracking-widest transition-colors hover:bg-gray-900 hover:text-white"
            >
              {isEditing ? "View Details" : "Edit Profile"}
            </button>
          </div>

          <div className="mt-10 w-full">
            {!isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <div className="w-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-[#DE4646]">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Contact
                    </h3>
                  </div>
                  <InfoRow label="Email" value={user?.email ?? "—"} />
                  <InfoRow label="Phone" value={user?.phone ?? "Not linked"} />
                </div>

                <div className="w-full rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-[#DE4646]">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </span>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">
                      Professional
                    </h3>
                  </div>
                  <InfoRow label="Position" value="Frontend Engineer" />
                  <div className="pt-4">
                    <span className="text-xs uppercase tracking-widest text-gray-400 font-semibold">
                      Skills
                    </span>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {staticSkills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                          style={{
                            background:
                              "linear-gradient(135deg,#fff0f0,#ffe4e4)",
                            color: "#B72D2D",
                            border: "1px solid #f9c8c8",
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full rounded-3xl bg-white p-8 sm:p-12 shadow-xl ring-1 ring-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <TextInput
                    errors={errors}
                    label="User Name"
                    name="name"
                    register={register}
                    required
                  />
                  <TextInput
                    errors={errors}
                    label="User Email"
                    name="email"
                    register={register}
                    required
                  />
                  <TextInput
                    errors={errors}
                    label="Phone"
                    name="phone"
                    register={register}
                    required
                  />

                  <SelectInput
                    control={control}
                    errors={errors}
                    label="Position"
                    name="position"
                    options={refinedPositions}
                    register={register}
                    setValue={setValue}
                    saveAsId
                    placeholder="Select Position"
                  />

                  <MultiSelect
                    control={control}
                    errors={errors}
                    label="Skills"
                    name="skills"
                    options={refinedSkills}
                    placeholder="Select Skills"
                  />

                  <SelectInput
                    control={control}
                    errors={errors}
                    label="Currency"
                    name="currency"
                    options={[{ id: "EGP", name: "EGP" }]}
                    register={register}
                    setValue={setValue}
                    saveAsId
                  />

                  <div className="w-full flex items-center justify-end gap-3">
                    <button
                      type="button"
                      className="ring-1 ring-gray-600 px-4 py-2 rounded-2xl"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{
                        background:
                          "linear-gradient(135deg, #DE4646 0%, #9B1B1B 60%, #6B0F0F 100%)",
                      }}
                      className="tracking-wide text-white px-4 py-2 rounded-2xl"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedImage && (
        <ImageCropper
          imageSrc={selectedImage}
          onCancel={() => setSelectedImage(null)}
          onCropComplete={onCropComplete}
        />
      )}
    </div>
  );
}
