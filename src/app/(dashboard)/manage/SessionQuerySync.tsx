"use client";

import { useEffect, useRef } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";

export default function SessionQuerySync({
  queryClient,
}: {
  queryClient: QueryClient;
}) {
  const previousUserIdRef = useRef<string | null>(null);
  const { data: session } = authClient.useSession();
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

  return null;
}
