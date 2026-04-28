import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

let isRefreshing = false;
let queue: Array<() => void> = [];

const API = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true, // ✅ Important: sends cookies
});

const processQueue = () => {
  queue.forEach((cb) => cb());
  queue = [];
};

API.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Only retry on 401 if not already retrying
    if (
      error.response?.status === 401 &&
      !originalRequest?._retry &&
      !originalRequest?.url?.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          queue.push(() => resolve(API(originalRequest)));
        });
      }

      isRefreshing = true;

      try {
        // ✅ Call the dedicated refresh route (NOT the proxy)
        // The dedicated route updates accessToken + GlitciTokenExpiry cookies
        await axios.post("/api/auth/refresh", null, {
          withCredentials: true,
        });
        isRefreshing = false;
        processQueue();
        return API(originalRequest);
      } catch (err) {
        isRefreshing = false;
        queue = [];
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  },
);

export default API;
