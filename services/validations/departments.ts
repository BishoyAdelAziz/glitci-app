import z from "zod";
export const CreateDepartmentSchema = z.object({
  name: z
    .string("Department Name must be text")
    .nonempty("Department Name is Required"),
});
export type AddDepartmentFormFIelds = z.infer<typeof CreateDepartmentSchema>;
