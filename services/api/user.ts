import axiosInstance from "@/lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string;
  role: string;
}

interface MeResponse {
  success: boolean;
  data: User;
}

export const getMeApi = async (): Promise<User> => {
  const res = await axiosInstance.get<MeResponse>("/users/me");
  return res.data.data;
};
