"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  // Always return "light" on server to match script behavior
  if (typeof window === "undefined") return "light";

  // On client, read from DOM instead of localStorage
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export default function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Sync DOM + storage when theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return { theme, toggleTheme };
}
