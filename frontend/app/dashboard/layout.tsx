"use client";

import type React from "react";

import { ProtectedRoute } from "@/components/protected-route";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
