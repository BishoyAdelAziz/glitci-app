import axios from "axios";
const AuthInstance = axios.create({
  baseURL: "/api/auth",
  withCredentials: true,
});
export default AuthInstance;
