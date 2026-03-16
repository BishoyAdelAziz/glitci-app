// hooks/useLogin.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginApi } from "@/services/api/auth";

export function useLogin() {
  const queryClient = useQueryClient();
  const { mutate, isError, isPending, error } = useMutation({
    mutationFn: loginApi,
    onSuccess: () => {
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
