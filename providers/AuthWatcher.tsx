"use client";

import { useEffect, useRef } from "react";
import axios from "axios";

export default function AuthWatcher() {
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);
  const isRefreshing = useRef(false);

  const getExpiry = () => {
    if (typeof document === "undefined") return null;
    const cookies = document.cookie.split("; ");
    const row = cookies.find((c) => c.startsWith("GlitciTokenExpiry="));

    if (!row) return null;

    try {
      const val = decodeURIComponent(row.split("=")[1]);
      const date = new Date(val);
      if (isNaN(date.getTime())) return null;
      return date.getTime();
    } catch {
      return null;
    }
  };

  const refreshToken = async () => {
    if (isRefreshing.current) return;

    try {
      isRefreshing.current = true;
      console.log("🔄 Proactive refresh triggered...");

      // ✅ Call the dedicated refresh route (NOT the proxy)
      await axios.post("/api/auth/refresh", null, {
        withCredentials: true,
      });

      console.log("✅ Token successfully refreshed");
      scheduleRefresh(); // Reschedule next refresh
    } catch (err) {
      console.error("❌ Refresh failed, redirecting to login");
      window.location.href = "/login";
    } finally {
      isRefreshing.current = false;
    }
  };

  const scheduleRefresh = () => {
    const expiry = getExpiry();
    if (!expiry) {
      console.warn("⚠️ No GlitciTokenExpiry cookie found. Static fallback not possible on client.");
      return;
    }

    const now = Date.now();
    // Refresh 60 seconds before expiry
    const delay = expiry - now - 60 * 1000;

    if (delay <= 0) {
      console.log("🕒 Token is almost expired or already expired. Refreshing now.");
      refreshToken();
      return;
    }

    if (refreshTimeout.current) {
      clearTimeout(refreshTimeout.current);
    }

    console.log(`🕒 Next refresh scheduled in ${Math.round(delay / 1000)}s`);

    refreshTimeout.current = setTimeout(() => {
      refreshToken();
    }, delay);
  };

  useEffect(() => {
    scheduleRefresh();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        scheduleRefresh(); // Resync when tab becomes active
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return null;
}
