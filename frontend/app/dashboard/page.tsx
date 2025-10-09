"use client";

import { useAuth } from "@/lib/auth-context";
import { KpiCards } from "@/components/kpi-cards";
import { RecentSales } from "@/components/recent-sales";
import { LowStockAlert } from "@/components/low-stock-alert";
import { useProductStore } from "@/lib/use-products";
import { useEffect } from "react";
import { useSalesStore } from "@/lib/use-sales";

export default function DashboardPage() {
  const { user } = useAuth();

  useEffect(() => {
    useProductStore.getState().fetchProducts();
    useSalesStore.getState().fetchSales();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name}. Here&apos;s what&apos;s happening with
          your shop today.
        </p>
      </div>

      <KpiCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentSales />
        <LowStockAlert />
      </div>
    </div>
  );
}
