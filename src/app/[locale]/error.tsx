"use client";

import ErrorView from "@/components/error/ErrorView";
import { usePathname } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1];
  const validLocale = locale === "ka" ? "ka" : "en";

  return (
    <ErrorView locale={validLocale} digest={error.digest} reset={reset} />
  );
}
