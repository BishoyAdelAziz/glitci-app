import axios from "axios";
const axiosInstance = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true, // Required to send/receive cookies
});
export default axiosInstance;
