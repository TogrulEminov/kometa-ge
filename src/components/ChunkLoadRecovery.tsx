"use client";

import { useEffect } from "react";

const RELOAD_KEY = "kometa-chunk-reload";

function shouldReloadFromError(message: string): boolean {
  return (
    message.includes("ChunkLoadError") ||
    message.includes("Loading chunk") ||
    message.includes("Failed to load chunk") ||
    message.includes("Failed to fetch dynamically imported module")
  );
}

export default function ChunkLoadRecovery() {
  useEffect(() => {
    const reloadOnce = (message: string) => {
      if (!shouldReloadFromError(message)) return;
      if (sessionStorage.getItem(RELOAD_KEY)) return;

      sessionStorage.setItem(RELOAD_KEY, "1");
      window.location.reload();
    };

    const onError = (event: ErrorEvent) => {
      reloadOnce(event.message || "");
    };

    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === "string"
            ? reason
            : "";

      reloadOnce(message);
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return null;
}
