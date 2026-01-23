import axiosInstance from "@/lib/axios";
import { User } from "@/types/user";
interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export const loginApi = async (data: LoginData): Promise<LoginResponse> => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const getMeApi = async () => {
  const res = await axiosInstance.get("/users/me");
  return res.data;
};
