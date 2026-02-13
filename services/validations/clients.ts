import z from "zod";
export const ClientSchema = z.object({
  name: z
    .string("Client Name Must be String")
    .nonempty("Client Name is Required"),
  companyName: z
    .string("Company Name Must be String")
    .nonempty("Company Name is Required"),
  email: z.email("invalid Email").nonempty("Client Email is Required"),
  phones: z
    .array(
      z
        .string("invalid Number")
        .min(11, "Phone must be at Least 11 digits")
        .max(13, "Phone must be maxmum 13 digits"),
    )
    .min(1, "at least one number required"),
  industry: z
    .string("Industry Must be String")
    .nonempty("Industry is Required"),
  notes: z.string("Notes Must be String"),
});
export type AddClientSchema = z.infer<typeof ClientSchema>;
