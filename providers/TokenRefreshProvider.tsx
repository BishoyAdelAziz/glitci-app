// components/providers/token-refresh-provider.tsx
"use client";

import { useTokenRefresh } from "@/hooks/useTokenRefresh";

export function TokenRefreshProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useTokenRefresh();

  return <>{children}</>;
}
