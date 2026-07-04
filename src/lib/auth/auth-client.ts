import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

function getAuthBaseURL() {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return (
    process.env.BETTER_AUTH_URL ||
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://localhost:3000"
  );
}

export const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  plugins: [
    inferAdditionalFields({
      user: { role: { type: "string" } },
    }),
  ],
});