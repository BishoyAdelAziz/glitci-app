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
  const response = await axiosInstance.patch("/auth/change-password", data);
  return response.data;
};
export const SetInitialPassword = async (data: { newPassword: string }) => {
  const response = await axiosInstance.patch(
    "/auth/set-initial-password",
    data,
  );
  return response.data;
};
