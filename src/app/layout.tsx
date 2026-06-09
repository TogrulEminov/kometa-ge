import type { Metadata } from "next";
import "@/src/styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  ),
  title: {
    template: "%s",
    default: "Profi Transport",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}