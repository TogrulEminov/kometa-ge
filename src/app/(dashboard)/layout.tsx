import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    template: "%s",
    default: "Kometa Ge",
  },
  // Admin üçün noindex, nofollow tənzimləmələri
  robots: {
    index: false,
    follow: false,
    nocache: true, // Admin paneldə keşlənmənin qarşısını almaq daha yaxşıdır
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    robots: "noai, noimageai",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", rel: "icon", sizes: "any" },
      { url: "/favicon.ico", rel: "icon", type: "image/ico", sizes: "32x32" },
    ],
    apple: [
      {
        url: "/favicon.ico.ioc",
        rel: "apple-touch-icon",
        sizes: "180x180",
        type: "image/ico",
      },
    ],
  },
};

const inter = Inter({
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin", "latin-ext"],
});

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang={"ka"} className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased`}
        suppressHydrationWarning
      >
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center min-h-screen bg-white  transition-colors duration-300">
              <div className="h-12 w-12 border-[4px] border-indigo-500 border-t-transparent border-solid rounded-full animate-spin"></div>
              <p className="mt-4 text-lg font-medium text-gray-700 dark:text-gray-300">
                Məlumat yüklənir...
              </p>

              <p className="mt-1 text-sm text-gray-500 dark:text-gray-500">
                Zəhmət olmasa gözləyin.
              </p>
            </div>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
