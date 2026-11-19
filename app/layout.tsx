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
  metadataBase: new URL("https://diana-portfolio-two-roan.vercel.app"),
  title: {
    default: "Diana Tsymbaliuk | Full-Stack Developer",
    template: "%s | Diana Tsymbaliuk",
  },
  description:
    "Portfolio of Diana Tsymbaliuk, full-stack developer in Berlin: React, Next.js, TypeScript, Node.js and SQL, with working demo projects.",
  alternates: { canonical: "/", languages: { en: "/", de: "/de" } },
  openGraph: {
    type: "website",
    siteName: "Diana Tsymbaliuk",
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
