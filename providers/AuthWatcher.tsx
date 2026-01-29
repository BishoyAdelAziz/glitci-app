"use client";
import { useEffect } from "react";
import axiosInstance from "@/lib/axios";

export default function AuthWatcher() {
  useEffect(() => {
    const checkToken = async () => {
      const cookies = document.cookie.split("; ");
      const expiryCookie = cookies.find((row) =>
        row.startsWith("GlitciTokenExpiry="),
      );

      if (!expiryCookie) return;

      const expiryValue = decodeURIComponent(expiryCookie.split("=")[1]);
      const expiryTime = new Date(expiryValue).getTime();
      const now = Date.now();

      // Trigger refresh if less than 5 minutes remain
      if (expiryTime - now < 5 * 60 * 1000) {
        try {
          await axiosInstance.post("/auth/refresh");
          console.log("Token successfully refreshed");
        } catch (error) {
          console.error("Silent refresh failed");
        }
      }
    };

    const interval = setInterval(checkToken, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return null;
}
