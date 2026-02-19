import type { Metadata } from "next";
import { Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SITE } from "@/lib/constants";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: SITE.title,
  description: SITE.description,
  keywords: [
    "problem solvers",
    "business automation",
    "lead generation",
    "AI integration",
    "Calgary",
    "consulting",
    "web development",
  ],
  openGraph: {
    title: SITE.title,
    description: SITE.description,
    url: `https://${SITE.domain}`,
    siteName: SITE.name,
    locale: "en_CA",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-alive="false">
      <body
        className={`${spaceGrotesk.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
