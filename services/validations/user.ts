import z from "zod";
const CurrencyEnum = z.enum(["EGP", "SAR", "AED", "USD", "EUR"]);

export const UpdateUserSchema = z.object({
  name: z.string().nonempty("Name is Required"),
  phone: z
    .string()
    .min(11, "Too short Phone Number")
    .max(13, "Too Long Phone Number")
    .nonempty("Phone is Required")
    .nullable(),
  email: z.email().nonempty("Email is Required"),
  position: z.string().nonempty("Position is required"),
  skills: z.array(z.string()).min(1, "at least one number required"),
  currency: CurrencyEnum,
});
export type UpdateUserSchemaFormFilds = z.infer<typeof UpdateUserSchema>;
