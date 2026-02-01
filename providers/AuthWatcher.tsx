"use client";
import { useEffect } from "react";
import axiosInstance from "@/lib/axios";

export default function AuthWatcher() {
  useEffect(() => {
    const checkAndRefresh = async () => {
      const cookies = document.cookie.split("; ");
      const expiryRow = cookies.find((row) =>
        row.startsWith("GlitciTokenExpiry="),
      );

      if (!expiryRow) return;

      const expiryValue = decodeURIComponent(expiryRow.split("=")[1]);
      const expiryTime = new Date(expiryValue).getTime();
      const now = Date.now();

      // Refresh 5 minutes before the 1-hour access token expires
      const threshold = 5 * 60 * 1000;

      if (expiryTime - now < threshold) {
        try {
          // The proxy handles sending the backend cookies and updating the expiry
          await axiosInstance.post("/auth/refresh");
          console.log("Token refreshed.");
        } catch (err) {
          console.error("Refresh failed.");
        }
      }
    };

    const interval = setInterval(checkAndRefresh, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  return null;
}
