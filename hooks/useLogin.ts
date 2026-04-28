// hooks/useLogin.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi, getMeApi } from "@/services/api/auth";
import type { UserRole } from "@/types/user";

/** Write a plain cookie accessible by Next.js middleware (no HttpOnly). */
function setRoleCookie(role: UserRole) {
  // 30-day expiry to match typical session length
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `GlitciUserRole=${role}; path=/; expires=${expires}; SameSite=Lax`;
}

function setMustChangePasswordCookie(mustChange: boolean) {
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `GlitciMustChangePassword=${mustChange}; path=/; expires=${expires}; SameSite=Lax`;
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: loginApi,
    onSuccess: async (response) => {
      try {
        // Use the role from the login response if available, otherwise fetch it.
        // This avoids an extra API call in most cases.
        const role = response?.data?.role;
        if (role) {
          setRoleCookie(role as UserRole);
        } else {
          const me = await getMeApi();
          setRoleCookie((me?.data?.role ?? "admin") as UserRole);
        }

        // Set the mustChangePassword cookie so the proxy/middleware knows to redirect
        setMustChangePasswordCookie(!!response.mustChangePassword);
      } catch {
        // If everything fails, default to "admin"
        setRoleCookie("admin");
      }
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
  return {
    mutate,
    isError,
    isPending,
    error,
  };
}
