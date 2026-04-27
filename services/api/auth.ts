import AuthInstance from "@/lib/auth";
import axiosInstance from "@/lib/axios";

export const loginApi = async (data: any) => {
  const response = await AuthInstance.post("/login", data);
  return response.data;
};

export const getMeApi = async () => {
  const res = await axiosInstance.get("/users/me");
  return res.data;
};
export const LogOut = async () => {
  const res = await AuthInstance.post("/logout");
  return res.data;
};
export const ChangePassword = async (data) => {
  const response = await AuthInstance.patch("/change-password", data);
  return response.data;
};
export const SetInitialPassword = async (data: { newPassword: string }) => {
  const response = await axiosInstance.patch(
    "/auth/set-initial-password",
    data,
  );
  return response.data;
};
export const ForgotPassword = async (data: { email: string | null }) => {
  const response = await axiosInstance.post("/auth/forgot-password", data);
  return response.data;
};
export const ResetPassword = async (data: {
  email: string | null;
  newPassword: string;
}) => {
  const response = await axiosInstance.post("/auth/reset-password", data);
  return response.data;
};
export const verifyCode = async (data: {
  email: string | null;
  resetCode: string;
}) => {
  const response = await axiosInstance.post("/auth/verify-reset-code", data);
  return response.data;
};
