import { z } from "zod";

const CURRENCIES = ["EGP", "SAR", "AED", "USD", "EUR"] as const;
const PAYMENT_METHODS = [
  "cash",
  "instapay",
  "wallet",
  "card",
  "other",
] as const;
const STATUSES = ["completed", "pending", "cancelled"] as const;

// ─── Shared amount preprocessor ───────────────────────────────────────────────
// z.coerce.number() causes `unknown` in the inferred type when used with useForm<T>.
// Using z.preprocess keeps the output type as `number` correctly.
const amountField = z.preprocess(
  (v) => (v === "" || v === undefined ? undefined : Number(v)),
  z.number("Amount must be a number").positive("Amount must be positive"),
);

// ─── Client Payment ───────────────────────────────────────────────────────────
export const clientPaymentSchema = z.object({
  project: z.string().min(1, "Project is required"),
  client: z.string().min(1, "Client is required"),
  amount: amountField,
  currency: z.enum(CURRENCIES),
  description: z.string().optional(),
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
  reference: z.string().optional(),
  status: z.enum(STATUSES).optional(),
});
export type ClientPaymentFormData = z.infer<typeof clientPaymentSchema>;

// ─── Employee Payment (salary + bonus) ───────────────────────────────────────
export const employeePaymentSchema = z.object({
  employee: z.string().min(1, "Employee is required"),
  amount: amountField,
  currency: z.enum(CURRENCIES),
  category: z.enum(["employee_salary", "employee_bonus"]).optional(),
  project: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
  reference: z.string().optional(),
});
export type EmployeePaymentFormData = z.infer<typeof employeePaymentSchema>;

// ─── General Expense (equipment, software, marketing, office, utilities, other) ─
export const generalExpenseSchema = z.object({
  project: z.string().optional(),
  category: z.enum([
    "equipment",
    "software",
    "marketing",
    "office",
    "utilities",
    "other_expense",
  ]),
  amount: amountField,
  currency: z.enum(CURRENCIES),
  description: z.string().min(1, "Description is required"),
  paymentMethod: z.enum(PAYMENT_METHODS).optional(),
  reference: z.string().optional(),
});
export type GeneralExpenseFormData = z.infer<typeof generalExpenseSchema>;
