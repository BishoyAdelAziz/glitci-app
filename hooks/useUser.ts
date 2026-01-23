"use client";

import { useQuery } from "@tanstack/react-query";
import { getMeApi } from "@/services/api/user";

export default function useUser() {
  const {
    data: user,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["me"],
    queryFn: getMeApi,
    retry: false, // important for auth
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    user,
    isPending,
    isAuthenticated: !!user,
    isError,
    error,
    refetchUser: refetch,
  };
}
