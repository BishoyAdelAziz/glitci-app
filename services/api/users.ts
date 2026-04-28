import axiosInstance from "@/lib/axios";


export const getUsers = async () => {
    const response = await axiosInstance("/users")
    return response.data
}