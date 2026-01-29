// hooks/useTokenRefresh.ts
"use client";

import { useEffect, useRef } from "react";
import axios from "axios";

export function useTokenRefresh() {
  // ✅ Fix: Initialize with null instead of empty object
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // ✅ Guard: only run in browser
    if (typeof window === "undefined") return;

    const checkAndRefreshToken = async () => {
      const accessTokenExpires = localStorage.getItem("accessTokenExpires");

      if (!accessTokenExpires) return;

      const expiresAt = new Date(accessTokenExpires).getTime();
      const now = Date.now();

      // Refresh 4 minutes (240000ms) before expiry
      const shouldRefresh = expiresAt - now < 4 * 60 * 1000;

      if (shouldRefresh) {
        try {
          console.log("🔄 Refreshing access token...");

          const response = await axios.post("/api/proxy/auth/refresh");
          const { accessToken, accessTokenExpires: newExpiry } = response.data;

          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("accessTokenExpires", newExpiry);

          console.log("✅ Token refreshed successfully");
        } catch (error) {
          console.error("❌ Token refresh failed:", error);

          localStorage.removeItem("accessToken");
          localStorage.removeItem("accessTokenExpires");
          window.location.href = "/login";
        }
      }
    };

    // Check every 2 minutes
    intervalRef.current = setInterval(checkAndRefreshToken, 2 * 60 * 1000);

    // Check immediately on mount
    checkAndRefreshToken();

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
}
