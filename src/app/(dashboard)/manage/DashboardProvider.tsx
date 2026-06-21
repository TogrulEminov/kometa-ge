"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import AdminSessionProvider, {
  type AdminSessionData,
} from "./AdminSessionProvider";

export default function DashboardProvider({
  children,
  initialSession,
}: Readonly<{
  children: React.ReactNode;
  initialSession: AdminSessionData | null;
}>) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            gcTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnMount: true,
            refetchOnReconnect: true,
            retry: 1,
          },
          mutations: {
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AdminSessionProvider
        initialSession={initialSession}
        queryClient={queryClient}
      >
        {children}
      </AdminSessionProvider>
    </QueryClientProvider>
  );
}
