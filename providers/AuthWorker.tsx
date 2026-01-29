"use client";

import { useEffect } from "react";
import axiosInstance from "@/lib/axios";

export default function AuthWatcher() {
  useEffect(() => {
    const checkToken = async () => {
      // 1. Get expiry from cookie
      const cookies = document.cookie.split("; ");
      const expiryCookie = cookies.find((row) =>
        row.startsWith("GlitciTokenExpiry="),
      );
      if (!expiryCookie) return;

      const expiryStr = expiryCookie.split("=")[1];
      const expiryDate = new Date(decodeURIComponent(expiryStr)).getTime();
      const now = Date.now();

      // 2. Check if it expires in less than 5 minutes (300,000 ms)
      const fiveMinutes = 5 * 60 * 1000;

      if (expiryDate - now < fiveMinutes) {
        console.log("Token expiring soon, refreshing...");
        try {
          // This hits your proxy -> which hits {{baseURL}}/api/v1/auth/refresh
          await axiosInstance.post("/auth/refresh");
        } catch (error) {
          console.error("Silent refresh failed", error);
        }
      }
    };

    // Check every 1 minute
    const interval = setInterval(checkToken, 60000);
    return () => clearInterval(interval);
  }, []);

  return null; // This component renders nothing
}
