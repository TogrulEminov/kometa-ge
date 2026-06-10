import { Metadata } from "next";
import { Suspense } from "react";
export const metadata: Metadata = {
  title: {
    template: "%s",
    default: "Admin - Kometa Ge",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az" className="scroll-smooth">
      <body className="--font-inter --font-dmsans antialiased">
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
