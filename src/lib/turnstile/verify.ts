type TurnstileVerifyResponse = {
  success: boolean;
  "error-codes"?: string[];
};

export async function verifyTurnstile(token: string, ip?: string | null) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Turnstile] TURNSTILE_SECRET_KEY missing — skipping in dev");
      return;
    }
    throw new Error("Captcha configuration error");
  }

  if (!token) {
    throw new Error("Captcha verification required");
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (ip) {
    body.append("remoteip", ip);
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  const result = (await response.json()) as TurnstileVerifyResponse;

  if (!result.success) {
    throw new Error("Captcha verification failed");
  }
}
