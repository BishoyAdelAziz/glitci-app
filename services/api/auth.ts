import axiosInstance from "@/lib/axios";

export const loginApi = async (data: any) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const getMeApi = async () => {
  const res = await axiosInstance.get("/users/me");
  return res.data;
};
