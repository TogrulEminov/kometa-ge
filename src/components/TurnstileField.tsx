"use client";

import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef } from "react";

type TurnstileFieldProps = {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
  theme?: "light" | "dark" | "auto";
};

export default function TurnstileField({
  onVerify,
  onExpire,
  onError,
  className,
  theme = "dark",
}: TurnstileFieldProps) {
  const ref = useRef<TurnstileInstance>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  if (!siteKey) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div
          className={`rounded-lg border border-dashed border-white/20 bg-white/5 px-4 py-3 text-xs text-muted ${className ?? ""}`}
        >
          Turnstile: add NEXT_PUBLIC_TURNSTILE_SITE_KEY to .env
        </div>
      );
    }
    return null;
  }

  return (
    <div className={className}>
      <Turnstile
        ref={ref}
        siteKey={siteKey}
        onSuccess={onVerify}
        onExpire={() => {
          onExpire?.();
          ref.current?.reset();
        }}
        onError={() => {
          onError?.();
          ref.current?.reset();
        }}
        options={{ theme, size: "flexible" }}
      />
    </div>
  );
}
