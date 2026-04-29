import z from "zod";
export const AddUserSchema = z.object({
  name: z.string().nonempty("Name is Required"),
  email: z.email().nonempty("Email is Required"),
  role: z.string().nonempty("Role is Required"),
});
export type AddUserSchemaTypes = z.infer<typeof AddUserSchema>;
