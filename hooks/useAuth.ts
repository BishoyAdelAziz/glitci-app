// hooks/useAuth.ts
"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getMeApi, LogOut } from "@/services/api/auth";
export default function useAuth() {
  const {
    data: user,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMeApi,
    retry: false, //
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
  const {
    mutate: LogoutMutation,
    isPending: LogoutMutationIsPending,
    isError: LogoutMutationIsError,
    error: LogoutMutationError,
  } = useMutation({
    mutationFn: LogOut,
    onSuccess: () => {
      window.location.href = "/login";
    },
  });
  return {
    user,
    isPending,
    isError,
    error,
    isAuthenticated: !!user,
    refetch,
    LogoutMutation,
    LogoutMutationIsPending,
    LogoutMutationIsError,
    LogoutMutationError,
  };
}
