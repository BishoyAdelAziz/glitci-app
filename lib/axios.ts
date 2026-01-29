// lib/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/api/proxy",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor - attach accessToken from localStorage
axiosInstance.interceptors.request.use(
  async (config) => {
    // ✅ Guard: only access localStorage in browser
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // ✅ Guard: only run in browser
    if (typeof window === "undefined") {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // If 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call refresh endpoint
        const response = await axios.post("/api/proxy/auth/refresh");

        const { accessToken, accessTokenExpires } = response.data;

        // Store new tokens
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("accessTokenExpires", accessTokenExpires);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear everything and redirect to login
        localStorage.removeItem("accessToken");
        localStorage.removeItem("accessTokenExpires");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
