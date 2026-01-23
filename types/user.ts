export interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  image: string;
  role: "admin" | "user" | string; // keep flexible if roles expand
  isActive: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}
