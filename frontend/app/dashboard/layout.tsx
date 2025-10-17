"use client";

import type React from "react";

import { ProtectedRoute } from "@/components/protected-route";
import { Sidebar } from "@/components/sidebar";
import { useEffect, useTransition } from "react";
import { useProductStore } from "@/lib/use-products";
import { useSalesStore } from "@/lib/use-sales";
import { Spinner } from "@/components/ui/spinner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      useProductStore.getState().fetchProducts();
      useSalesStore.getState().fetchSales();
    });
  }, []);

  if (isPending)
    return (
      <div className=" flex min-h-screen items-center gap-6">
        <Spinner className="size-6 text-blue-600" />
      </div>
    );

  return (
    <ProtectedRoute>
      <div className="flex  overflow-y-auto h-screen">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
