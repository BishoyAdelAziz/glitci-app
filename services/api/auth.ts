// services/api/auth.ts
import axiosInstance from "@/lib/axios";
import { User } from "@/types/user";

interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  data: User;
  accessToken: string;
  accessTokenExpires: string;
  mustChangePassword: boolean;
}

export const loginApi = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axiosInstance.post("/auth/login", data);

  // ✅ Store accessToken and expiry in localStorage
  const { accessToken, accessTokenExpires } = response.data;
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("accessTokenExpires", accessTokenExpires);

  return response.data;
};

export const getMeApi = async () => {
  const res = await axiosInstance.get("/users/me");
  return res.data;
};

export const logoutApi = async () => {
  // Clear localStorage
  localStorage.removeItem("accessToken");
  localStorage.removeItem("accessTokenExpires");

  // Optional: call backend logout endpoint if exists
  // await axiosInstance.post("/auth/logout");
};
