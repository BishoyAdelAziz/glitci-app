import z from "zod";
export const AddEmployeeSchema = z.object({
  name: z
    .string("Employee Name must be String")
    .nonempty("Empoyee Name is Required"),
  email: z.email("invalid Email").nonempty("Email is Required"),
  phone: z
    .string("invalid Number")
    .min(11, "Phone must be at Least 11 digits")
    .max(13, "Phone must be maxmum 13 digits"),

  department: z.string().nonempty("Department is required"),
  position: z.string().nonempty("Position is required"),
  skills: z.array(z.string()).min(1, "at least one number required"),
});
export type AddEmployeeFormFIelds = z.infer<typeof AddEmployeeSchema>;
