// hooks/useAuth.ts
"use client";

import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "@/services/api/auth";

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

  return {
    user,
    isPending,
    isError,
    error,
    isAuthenticated: !!user,
    refetch,
  };
}
