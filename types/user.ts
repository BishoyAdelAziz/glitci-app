// All supported user roles in the system.
// "accounting_manager" and "operation_manager" are placeholders — routes TBD from backend.
export type UserRole =
  | "admin"
  | "employee"
  | "accounting_manager"
  | "operation_manager"
  | (string & {}); // keep flexible for future roles

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string;
  role: UserRole;
  isActive: boolean;
  currency?: "EGP" | "SAR" | "AED" | "USD" | "EUR";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
