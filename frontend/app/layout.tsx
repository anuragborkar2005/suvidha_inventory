import type React from "react";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { OnlineProvider } from "@/lib/use-online";

const dmSans = localFont({
  src: "./fonts/DMSans-Variable.ttf",
  variable: "--font-dm-sans",
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
    <html lang="en" className="light">
      <AuthProvider>
        <OnlineProvider>
          <body className={`font-sans ${dmSans.className} fixed inset-0`}>
            {children}
          </body>
        </OnlineProvider>
      </AuthProvider>
    </html>
  );
}
