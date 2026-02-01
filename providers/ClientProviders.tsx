"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import AuthWatcher from "./AuthWatcher";
import { ThemeProvider } from "./themeProvider";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthWatcher />
      <ThemeProvider>{children}</ThemeProvider>
    </QueryClientProvider>
  );
}
