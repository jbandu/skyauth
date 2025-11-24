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

// Force dynamic rendering to ensure DATABASE_URL is available at runtime
export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Safely get session - don't fail build if DATABASE_URL is not available
  // During build phase, Next.js might try to analyze this code even with force-dynamic
  let session = null;
  const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
  
  if (!isBuildPhase) {
    try {
      session = await auth();
    } catch (error) {
      // Log errors at runtime, but don't fail the request
      console.error("Failed to get session in layout:", error);
    }
  }
  // During build, session will be null, which is fine - it will be fetched at runtime
  
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
