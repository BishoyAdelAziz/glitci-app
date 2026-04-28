import z from "zod";

// ─── Create Asset Schema ─────────────────────────────────────────────────────────

export const CreateAssetSchema = z.object({
  name: z
    .string()
    .min(2, "Asset name must be at least 2 characters")
    .max(200, "Asset name must be at most 200 characters"),

  url: z.string().url("Must be a valid URL"),

  description: z
    .string()
    .min(1, "Description is required")
    .max(2000, "Description must be at most 2000 characters"),

  client: z.string().optional().or(z.literal("")),

  project: z.string().optional().or(z.literal("")),
});

export type CreateAssetFormFields = z.infer<typeof CreateAssetSchema>;

// ─── Update Asset Schema ─────────────────────────────────────────────────────────

export const UpdateAssetSchema = z.object({
  name: z
    .string()
    .min(2, "Asset name must be at least 2 characters")
    .max(200, "Asset name must be at most 200 characters")
    .optional(),

  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .optional()
    .or(z.literal("")),

  client: z.string().optional().or(z.literal("")),

  project: z.string().optional().or(z.literal("")),
});

export type UpdateAssetFormFields = z.infer<typeof UpdateAssetSchema>;
