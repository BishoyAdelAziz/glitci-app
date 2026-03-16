import z from "zod";
export const AddSkillSchema = z.object({
  position: z.string().nonempty("Department is required"),
  name: z.string().nonempty("Department is required"),
});
export type AddSkillFormFIelds = z.infer<typeof AddSkillSchema>;
