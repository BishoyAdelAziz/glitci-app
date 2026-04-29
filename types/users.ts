import { Currency } from "./projects";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string;
  role: string;
  isActive: boolean;
  updatedAt: string;
  createdAt: string;
  cureency: Currency;
}
