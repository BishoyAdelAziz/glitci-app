import axiosInstance from "@/lib/axios";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image: string | null;
  role: string;
  currency: "EGP" | "SAR" | "AED" | "USD" | "EUR";
}

interface MeResponse {
  success: boolean;
  data: User;
}

export const getMeApi = async (): Promise<User> => {
  const res = await axiosInstance.get<MeResponse>("/users/me");
  return res.data.data;
};
export const updateMeApi = async (data: Partial<User>): Promise<User> => {
  const res = await axiosInstance.patch<MeResponse>("/users/me", data, {
    headers: {
      "Content-Type": "form-data",
    },
  });
  return res.data.data;
};
