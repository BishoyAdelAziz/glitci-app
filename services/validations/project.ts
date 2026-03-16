import { z } from "zod";

// MongoDB ObjectId validation (24 hex characters)

const CurrencyEnum = z.enum(["EGP", "SAR", "AED", "USD", "EUR"]);
const PriorityEnum = z.enum(["normal", "medium", "high"]);
const StatusEnum = z.enum(["planning", "active", "on_hold", "completed"]);

const EmployeeSchema = z.object({
  employee: z.string(),
  compensation: z.string(),
  currency: CurrencyEnum,
});

export const projectSchema = z
  .object({
    name: z
      .string()
      .min(1, "Project name is required")
      .max(100, "Project name is too long"),
    description: z.string().optional(),
    client: z.string(),
    department: z.string(),
    budget: z.string(),
    currency: CurrencyEnum,
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
    priority: PriorityEnum,
    status: StatusEnum,
    services: z.array(z.string()).min(1, "At least one service is required"),
    employees: z
      .array(EmployeeSchema)
      .min(1, "At least one employee is required"),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

export type ProjectFormData = z.infer<typeof projectSchema>;
export const ProjectEditSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name is too long"),
  budget: z.string(),
  currency: CurrencyEnum,
  status: StatusEnum,
  employees: z
    .array(EmployeeSchema)
    .min(1, "At least one employee is required"),
});
export type ProjectEditFormData = z.infer<typeof ProjectEditSchema>;
