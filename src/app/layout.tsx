import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PWA Push Test",
  description: "PWA Push Test Application",
  manifest: "/manifest.json",
  themeColor: "#8936FF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PWA Push Test",
  },
  icons: {
    apple: "/icon512_rounded.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={geistSans.className}>{children}</body>
    </html>
  );
}
