import z from "zod";

export const ClientSchema = z.object({
  name: z.string().min(1, "Client Name is Required"),
  companyName: z.string().min(1, "Company Name is Required"),
  email: z
    .union([z.string().email("Invalid Email"), z.literal(""), z.null()])
    .optional(),
  phones: z
    .array(
      z
        .string()
        .min(11, "Phone must be at least 11 digits")
        .max(13, "Phone must be maximum 13 digits"),
    )
    .min(1, "At least one number required"),
  industry: z.string().min(1, "Industry is Required"),
  notes: z.string().optional(),
});

export type AddClientSchema = z.infer<typeof ClientSchema>;
