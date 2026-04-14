// hooks/useAuth.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChangePassword,
  ForgotPassword,
  getMeApi,
  LogOut,
  ResetPassword,
  SetInitialPassword,
  verifyCode,
} from "@/services/api/auth";
import { useRouter } from "next/navigation";
export default function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
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
    staleTime: 1000 * 60 * 5,
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
  const {
    mutate: ChangePasswordMutation,
    isError: ChangePasswordIsError,
    isPending: ChangePasswordIsPending,
    error: ChangePasswordError,
  } = useMutation({
    mutationFn: ChangePassword,
    onSuccess: async () => {
      queryClient.clear();
      try {
        await LogOut();
      } catch (_) {}
      window.location.href = "/login";
    },
  });
  const {
    mutate: SetInitialPasswordMutation,
    isError: SetInitialPasswordIsError,
    isPending: SetInitialPasswordIsPending,
    error: SetInitialPasswordError,
  } = useMutation({
    mutationFn: SetInitialPassword,
    onSuccess: async () => {
      queryClient.clear();
      try {
        await LogOut();
      } catch (_) {}
      window.location.href = "/login";
    },
  });
  const {
    mutate: ForgotPasswordMutation,
    isPending: ForgotPasswordisPending,
    isError: ForgotPasswordisError,
    error: ForgotPasswordError,
  } = useMutation({
    mutationFn: ForgotPassword,
  });
  const {
    mutate: VerifyCodeMutation,
    isPending: VerifyCodeIsPending,
    isError: VerifyCodeIsError,
    error: VerifyCodeError,
  } = useMutation({
    mutationFn: verifyCode,
  });
  const {
    mutate: ResetPasswordMutation,
    isError: ResetPasswordIsError,
    isPending: ResetPasswordIsPending,
    error: ResetPasswordError,
  } = useMutation({
    mutationFn: ResetPassword,
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
    ChangePasswordMutation,
    ChangePasswordIsError,
    ChangePasswordIsPending,
    ChangePasswordError,
    SetInitialPasswordMutation,
    SetInitialPasswordIsError,
    SetInitialPasswordIsPending,
    SetInitialPasswordError,
    ForgotPasswordMutation,
    ForgotPasswordisPending,
    ForgotPasswordisError,
    ForgotPasswordError,
    VerifyCodeMutation,
    VerifyCodeIsPending,
    VerifyCodeIsError,
    VerifyCodeError,
    ResetPasswordMutation,
    ResetPasswordIsError,
    ResetPasswordIsPending,
    ResetPasswordError,
  };
}
