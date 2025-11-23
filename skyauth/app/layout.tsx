import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { SessionProvider } from "@/components/providers/session-provider";
import { auth } from "@/auth";
import { getBrandByCode } from "@/lib/branding";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkyAuth | Airline Workforce Platform",
  description:
    "SkyAuth delivers secure identity, multi-tenant HR tools, and real-time org insights for airline operators.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const brand = getBrandByCode("CM");

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={
          {
            "--airline-primary": brand.primary,
            "--airline-secondary": brand.secondary,
          } as CSSProperties
        }
      >
        <ThemeProvider>
          <SessionProvider session={session}>
            <div className="flex min-h-screen flex-col bg-background text-foreground">{children}</div>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
