"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { getMeApi, updateMeApi } from "@/services/api/user";

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
    retry: false,
  });
  const {
    mutate: UpdateMeMutation,
    isError: UpdateMeMutationIsError,
    error: UpdateMeMutationError,
    isPending: UpdateMeMutationIsPending,
  } = useMutation({
    mutationFn: updateMeApi,
    onSuccess: () => {
      refetch();
    },
  });
  return {
    user,
    isPending,
    isAuthenticated: !!user,
    isError,
    error,
    refetchUser: refetch,
    UpdateMeMutation,
    UpdateMeMutationIsError,
    UpdateMeMutationError,
    UpdateMeMutationIsPending,
  };
}
