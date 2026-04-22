"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import AuthWatcher from "./AuthWatcher";
import { ThemeProvider } from "./themeProvider";
import { Toaster } from "react-hot-toast";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthWatcher />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "12px",
            background: "#1f2937",
            color: "#f9fafb",
            fontSize: "14px",
          },
        }}
      />
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
