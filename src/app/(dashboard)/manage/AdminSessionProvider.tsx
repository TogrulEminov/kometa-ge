"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { QueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";

export type AdminSessionData = {
  user: {
    id: string;
    name: string;
    email: string;
    role?: string | null;
  };
};

type AdminSessionContextValue = {
  session: AdminSessionData | null;
  isPending: boolean;
};

const AdminSessionContext = createContext<AdminSessionContextValue | null>(
  null,
);

export function useAdminSession() {
  const context = useContext(AdminSessionContext);

  if (!context) {
    throw new Error("useAdminSession must be used within AdminSessionProvider");
  }

  return context;
}

export default function AdminSessionProvider({
  children,
  initialSession,
  queryClient,
}: {
  children: ReactNode;
  initialSession: AdminSessionData | null;
  queryClient: QueryClient;
}) {
  const previousUserIdRef = useRef<string | null>(
    initialSession?.user?.id ?? null,
  );
  const { data: clientSession, isPending } = authClient.useSession();
  const session = clientSession ?? (isPending ? initialSession : null);
  const currentUserId = session?.user?.id ?? null;

  useEffect(() => {
    if (
      previousUserIdRef.current &&
      currentUserId &&
      previousUserIdRef.current !== currentUserId
    ) {
      queryClient.clear();
    }

    previousUserIdRef.current = currentUserId;
  }, [currentUserId, queryClient]);

  return (
    <AdminSessionContext.Provider
      value={{
        session,
        isPending: isPending && !session,
      }}
    >
      {children}
    </AdminSessionContext.Provider>
  );
}
