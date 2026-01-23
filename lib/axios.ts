import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
});
export default axiosInstance;
