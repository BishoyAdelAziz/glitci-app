import { TransactionType, TransactionCategory } from "@/types/transactions";

export interface CategoryRoute {
  label: string;
  slug: string; // URL segment
  category: TransactionCategory; // API filter value
  type: TransactionType;
}

export const INCOME_ROUTES: CategoryRoute[] = [
  {
    label: "Client Payments",
    slug: "client_payment",
    category: "client_payment",
    type: "income",
  },
  {
    label: "Other Income",
    slug: "other_income",
    category: "other_income",
    type: "income",
  },
];

export const EXPENSE_ROUTES: CategoryRoute[] = [
  {
    label: "Employee Salary",
    slug: "employee_salary",
    category: "employee_salary",
    type: "expense",
  },
  {
    label: "Employee Payment",
    slug: "employee_payment",
    category: "employee_payment",
    type: "expense",
  },
  {
    label: "Employee Bonus",
    slug: "employee_bonus",
    category: "employee_bonus",
    type: "expense",
  },
  {
    label: "Equipment",
    slug: "equipment",
    category: "equipment",
    type: "expense",
  },
  {
    label: "Software",
    slug: "software",
    category: "software",
    type: "expense",
  },
  {
    label: "Marketing",
    slug: "marketing",
    category: "marketing",
    type: "expense",
  },
  { label: "Office", slug: "office", category: "office", type: "expense" },
  {
    label: "Utilities",
    slug: "utilities",
    category: "utilities",
    type: "expense",
  },
  {
    label: "Other Expense",
    slug: "other_expense",
    category: "other_expense",
    type: "expense",
  },
];

export const ALL_ROUTES: CategoryRoute[] = [
  ...INCOME_ROUTES,
  ...EXPENSE_ROUTES,
];

export const ROUTES_BY_TYPE: Record<TransactionType, CategoryRoute[]> = {
  income: INCOME_ROUTES,
  expense: EXPENSE_ROUTES,
};

export function findRoute(
  type: string,
  category: string,
): CategoryRoute | undefined {
  return ALL_ROUTES.find((r) => r.type === type && r.slug === category);
}
