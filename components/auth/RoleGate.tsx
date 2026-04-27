"use client";

import { type AppRole, getCurrentUserRole } from "@/config/roles";
import { Lock } from "lucide-react";

interface RoleGateProps {
  /** One or more roles to check against. */
  roles: AppRole | AppRole[];
  /** Content to render when the condition is met. */
  children: React.ReactNode;
  /** Optional fallback to render when the condition is NOT met. */
  fallback?: React.ReactNode;
}

/**
 * Renders children only if the current user's role is in the allowed list.
 *
 * @example
 * <AllowedFor roles="admin">
 *   <DeleteButton />
 * </AllowedFor>
 *
 * @example
 * <AllowedFor roles={["admin", "financial_manager"]} fallback={<p>No access</p>}>
 *   <RevenueChart />
 * </AllowedFor>
 */
export function AllowedFor({ roles, children, fallback = <Lock size={20} /> }: RoleGateProps) {
  const current = getCurrentUserRole();
  const allowed = Array.isArray(roles) ? roles : [roles];

  if (allowed.includes(current)) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}

/**
 * Renders children only if the current user's role is NOT in the forbidden list.
 *
 * @example
 * <ForbiddenFor roles="employee">
 *   <AdminPanel />
 * </ForbiddenFor>
 *
 * @example
 * <ForbiddenFor roles={["employee", "operation"]} fallback={<p>Restricted</p>}>
 *   <FinancialReport />
 * </ForbiddenFor>
 */
export function ForbiddenFor({
  roles,
  children,
  fallback = <Lock size={20} />,
}: RoleGateProps) {
  const current = getCurrentUserRole();
  const forbidden = Array.isArray(roles) ? roles : [roles];

  if (!forbidden.includes(current)) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
}
