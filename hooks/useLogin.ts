// hooks/useLogin.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "@/services/api/auth";

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
      // 🔥 Re-fetch authenticated user
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });
}
