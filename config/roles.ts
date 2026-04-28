import type { UserRole } from "@/types/user";

export type AppRole = "admin" | "financial_manager" | "operation" | "employee";

/**
 * Role → default landing page.
 * Must stay in sync with proxy.ts ROLE_HOME.
 */
export const ROLE_HOME: Record<string, string> = {
  admin: "/overview",
  financial_manager: "/overview",
  operation: "/projects",
  employee: "/tasks",
};

/**
 * Returns the home path for a given role.
 */
export function getHomeForRole(role?: AppRole | string | null): string {
  return ROLE_HOME[role ?? "admin"] ?? "/overview";
}

/**
 * Detect the current user type from cookie (client-side only).
 * Useful for conditional rendering in components.
 */
export function getCurrentUserRole(): AppRole {
  if (typeof document === "undefined") return "admin";
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith("GlitciUserRole="));
  return (cookie?.split("=")[1] as AppRole) ?? "admin";
}

/**
 * Check if the current user has a specific role (client-side).
 */
export function isUserRole(role: AppRole | AppRole[]): boolean {
  const currentRole = getCurrentUserRole();
  if (Array.isArray(role)) {
    return role.includes(currentRole);
  }
  return currentRole === role;
}
