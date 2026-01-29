// providers/query-client-provider.tsx
"use client";

import {
  QueryClient,
  QueryClientProvider as TanstackProvider,
} from "@tanstack/react-query";
import { useState } from "react";

export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ Create queryClient inside the client component
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return <TanstackProvider client={queryClient}>{children}</TanstackProvider>;
}
