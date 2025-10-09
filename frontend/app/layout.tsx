import type React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";
import { Suspense } from "react";
import { OnlineProvider } from "@/lib/use-online";

const inter = localFont({
  src: "./fonts/Inter-Variable.ttf",
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Suvidha Management System",
  description: "Admin and staff shop management application",
  icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`font-sans ${inter.className}`}>
        <Suspense fallback={null}>
          <OnlineProvider>
            <AuthProvider>{children}</AuthProvider>
          </OnlineProvider>
        </Suspense>
      </body>
    </html>
  );
}
