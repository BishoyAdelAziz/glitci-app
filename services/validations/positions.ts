import z from "zod";
export const AddPositionSchema = z.object({
  name: z
    .string("Employee Name must be String")
    .nonempty("Empoyee Name is Required"),
  description: z.string("Description Must be String"),
  department: z.string().nonempty("Department is required"),
});
export const EditPositionSchema = z.object({
  name: z
    .string("Employee Name must be String")
    .nonempty("Empoyee Name is Required"),
  description: z.string("Description Must be String"),
  department: z.string().nonempty("Department is required"),
});
export type AddPositionFormFields = z.infer<typeof AddPositionSchema>;
export type EditPositionFormFields = z.infer<typeof EditPositionSchema>;
