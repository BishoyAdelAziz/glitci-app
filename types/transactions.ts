// ─── Shared / Nested Types ───────────────────────────────────────────────────

import { ParamValue } from "next/dist/server/request/params";

export interface TransactionUser {
  _id: string;
  name: string;
  email: string;
}

export interface TransactionProject {
  _id: string;
  name: string;
}

export interface TransactionEmployee {
  _id: string;
  user: TransactionUser;
  department: string;
  position: string;
  skills: string[];
  employmentType: "freelancer" | "full-time" | "part-time";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface AmountConverted {
  AED: number;
  EGP: number;
  EUR: number;
  SAR: number;
  USD: number;
}

// ─── Enums ────────────────────────────────────────────────────────────────────

export type TransactionType = "expense" | "income";

export type IncomeCategory = "client_payment" | "other_income";

export type ExpenseCategory =
  | "employee_salary"
  | "employee_bonus"
  | "employee_payment"
  | "equipment"
  | "software"
  | "marketing"
  | "office"
  | "utilities"
  | "other_expense";

export type TransactionCategory = IncomeCategory | ExpenseCategory;

export type PaymentMethod = "instapay" | "card" | "cash" | "bank_transfer";

export type TransactionStatus = "completed" | "pending" | "cancelled";

export type Currency = "EGP" | "USD" | "EUR" | "AED" | "SAR";

// ─── Category Maps per Type ───────────────────────────────────────────────────

export const INCOME_CATEGORIES: { label: string; value: IncomeCategory }[] = [
  { label: "Client Payment", value: "client_payment" },
  { label: "Other Income", value: "other_income" },
];

export const EXPENSE_CATEGORIES: { label: string; value: ExpenseCategory }[] = [
  { label: "Employee Salary", value: "employee_salary" },
  { label: "Employee Bonus", value: "employee_bonus" },
  { label: "Equipment", value: "equipment" },
  { label: "Software", value: "software" },
  { label: "Marketing", value: "marketing" },
  { label: "Office", value: "office" },
  { label: "Utilities", value: "utilities" },
  { label: "Other Expense", value: "other_expense" },
];

export const CATEGORIES_BY_TYPE = {
  income: INCOME_CATEGORIES,
  expense: EXPENSE_CATEGORIES,
} as const;

// ─── Core Transaction ─────────────────────────────────────────────────────────

export interface Transaction {
  _id: string;
  type: TransactionType;
  category: TransactionCategory;
  project: TransactionProject;
  employee?: TransactionEmployee;
  amount: number;
  currency: Currency;
  amountConverted: AmountConverted;
  description: string;
  date: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  addedBy: TransactionUser;
  createdAt: string;
  updatedAt: string;
  __v: number;
  client: {
    _id: string;
    name: string;
    companyName: string;
  };
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface TransactionsQueryParams {
  page?: number;
  limit?: number;
  type?: TransactionType;
  category?: TransactionCategory;
  status?: TransactionStatus;
  paymentMethod?: PaymentMethod;
  currency?: Currency;
  projectId?: ParamValue | string;
  employeeId?: ParamValue | string;
  dateFrom?: string;
  dateTo?: string;
  name?: string;
  clientId?: ParamValue | string;
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface TransactionsResponse {
  totalPages: number;
  page: number;
  limit: number;
  results: number;
  data: Transaction[];
}

export interface SingleTransactionResponse {
  data: Transaction;
}
