"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body
        style={{
          margin: 0,
          fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif",
          backgroundColor: "var(--color-ui-6)",
          minHeight: "100vh",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "clamp(24px, 5vw, 48px)",
              borderRadius: "16px",
              boxShadow: "var(--shadow-1)",
              maxWidth: "520px",
              width: "100%",
              border: "1px solid var(--color-ui-2)",
            }}
          >
            {/* Icon / Visual */}
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                backgroundColor: "var(--color-ui-5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: "28px",
              }}
            >
              ⚠️
            </div>

            <h1
              style={{
                color: "var(--color-ui-1)",
                marginBottom: "12px",
                fontSize: "clamp(1.25rem, 3vw, 1.75rem)",
                fontWeight: 700,
                lineHeight: 1.3,
              }}
            >
              Texniki nasazlıq baş verdi
            </h1>

            <p
              style={{
                color: "var(--color-ui-7)",
                marginBottom: "28px",
                lineHeight: 1.6,
                fontSize: "clamp(0.875rem, 2vw, 1rem)",
              }}
            >
              Üzr istəyirik, gözlənilməz bir xəta baş verdi. Zəhmət olmasa,
              səhifəni yeniləyin və ya ana səhifəyə qayıdın.
            </p>

            {/* Debug info - only shows in development or if digest exists */}
            {error.digest && (
              <div
                style={{
                  backgroundColor: "var(--color-ui-10)",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  color: "var(--color-ui-1)",
                  marginBottom: "28px",
                  textAlign: "left",
                  overflowX: "auto",
                  border: "1px solid var(--color-ui-9)",
                  fontFamily: "monospace",
                }}
              >
                <strong style={{ color: "var(--color-ui-4)" }}>Xəta ID:</strong>{" "}
                {error.digest}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={() => reset()}
                style={{
                  backgroundColor: "var(--color-ui-4)",
                  color: "white",
                  border: "none",
                  padding: "12px 28px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  transition: "var(--ease-background), transform 0.2s ease",
                  fontFamily: "var(--font-dmsans), sans-serif",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "var(--color-ui-1)";
                  (e.target as HTMLButtonElement).style.transform =
                    "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "var(--color-ui-4)";
                  (e.target as HTMLButtonElement).style.transform =
                    "translateY(0)";
                }}
              >
                Yenidən cəhd edin
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                style={{
                  backgroundColor: "transparent",
                  color: "var(--color-ui-1)",
                  border: "1px solid var(--color-ui-2)",
                  padding: "12px 28px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: 600,
                  fontSize: "0.9375rem",
                  transition: "var(--ease-background), var(--ease-border)",
                  fontFamily: "var(--font-dmsans), sans-serif",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "var(--color-ui-3)";
                  (e.target as HTMLButtonElement).style.borderColor =
                    "var(--color-ui-4)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.backgroundColor =
                    "transparent";
                  (e.target as HTMLButtonElement).style.borderColor =
                    "var(--color-ui-2)";
                }}
              >
                Ana səhifə
              </button>
            </div>
          </div>

          <p
            style={{
              marginTop: "24px",
              color: "var(--color-ui-7)",
              fontSize: "13px",
              opacity: 0.7,
            }}
          >
            © 2026 Profi Transport LLC. Bütün hüquqlar qorunur.
          </p>
        </div>
      </body>
    </html>
  );
}
