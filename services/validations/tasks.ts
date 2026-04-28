import z from "zod";

export const TaskLinkSchema = z.object({
  name: z.string().min(1, "Link name is required"),
  url: z.string().url("Must be a valid URL"),
});

export const CreateTaskSchema = z
  .object({
    name: z
      .string("Task name is required")
      .min(2, "Task name must be at least 2 characters")
      .max(200, "Task name must be at most 200 characters"),

    description: z
      .string()
      .max(2000, "Description must be at most 2000 characters")
      .optional()
      .or(z.literal("")),

    startTime: z
      .string("Start time is required")
      .nonempty("Start time is required"),

    endTime: z
      .string("End time is required")
      .nonempty("End time is required"),

    assignedTo: z
      .string("Assigned employee is required")
      .nonempty("Assigned employee is required"),

    project: z.string().optional().or(z.literal("")),

    links: z.array(TaskLinkSchema).optional(),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      return new Date(data.endTime) > new Date(data.startTime);
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    },
  );

export type CreateTaskFormFields = z.infer<typeof CreateTaskSchema>;

// ─── Update Task Schema ─────────────────────────────────────────────────────────

export const UpdateTaskSchema = z.object({
  name: z
    .string()
    .min(2, "Task name must be at least 2 characters")
    .max(200, "Task name must be at most 200 characters")
    .optional(),
  description: z
    .string()
    .max(2000, "Description must be at most 2000 characters")
    .optional()
    .or(z.literal("")),
  assignedTo: z.string().optional(),
  project: z.string().optional().or(z.literal("")),
  links: z.array(TaskLinkSchema).optional(),
});

export type UpdateTaskFormFields = z.infer<typeof UpdateTaskSchema>;

