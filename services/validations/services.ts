import z from "zod";
export const AddServiceSchema = z.object({
  name: z
    .string("Service Name must be String")
    .min(2, "Service Name Must be More han 2 letters")
    .max(30, "Service Name Must be Less than 30 Letters"),
  description: z
    .string("Service Description must be String")
    .min(5, "Service Description Must be More than 5 letters")
    .max(100, "Service Description Must be Less Than 100 Letters"),
  department: z.string(),
});
export type AddServiceFormFields = z.infer<typeof AddServiceSchema>;
