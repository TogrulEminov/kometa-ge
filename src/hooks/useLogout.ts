"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useAction } from "next-safe-action/hooks";
import { logoutUser } from "@/actions/auth/auth.action";
import { authClient } from "@/lib/auth/auth-client";

async function resetClientAuthState(
  queryClient: ReturnType<typeof useQueryClient>,
) {
  queryClient.clear();
  await authClient.signOut();
}

export function useLogout() {
  const queryClient = useQueryClient();

  const finishLogout = async () => {
    await resetClientAuthState(queryClient);
    window.location.assign("/auth/login");
  };

  const { execute, isExecuting } = useAction(logoutUser, {
    onSuccess: finishLogout,
    onError: finishLogout,
  });

  return {
    logout: () => execute(undefined),
    isLoggingOut: isExecuting,
  };
}
