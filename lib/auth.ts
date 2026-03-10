import axios from "axios";
const AuthInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true, // Required to send/receive cookies
});
export default AuthInstance;
