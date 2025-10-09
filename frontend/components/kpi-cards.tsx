"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, TrendingUp, IndianRupee } from "lucide-react";
import { useProductStore } from "@/lib/use-products";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { Sale, useSalesStore } from "@/lib/use-sales";

export function KpiCards() {
  const products = useProductStore((s) => s.products);
  const { user } = useAuth();
  const sales = useSalesStore((s) => s.sales);
  const getTodayRevenue = useSalesStore((s) => s.getTodayRevenue);
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  useEffect(() => {
    const settings = localStorage.getItem("shop_settings");
    if (settings) {
      const parsed = JSON.parse(settings);
      setLowStockThreshold(parsed.lowStockThreshold || 10);
    }
  }, []);

  const lowStockCount = products.filter(
    (p) => p.stock_quantity <= lowStockThreshold
  ).length;
  const todaySalesCount = sales.filter((s: Sale) => {
    const today = new Date().toDateString();
    return new Date(s.created_at).toDateString() === today;
  }).length;
  const todayRevenue = getTodayRevenue();

  const kpis = [
    {
      title: "Total Products",
      value: products.length,
      icon: Package,
      description: "Active products in inventory",
      color: "text-primary",
      role: ["admin", "staff"],
    },
    {
      title: "Low Stock Items",
      value: lowStockCount,
      icon: AlertTriangle,
      description: "Products below threshold",
      color: "text-destructive",
      role: ["admin", "staff"],
    },
    {
      title: "Today's Sales",
      value: todaySalesCount,
      icon: TrendingUp,
      description: "Transactions completed today",
      color: "text-primary",
      role: ["admin", "staff"],
    },
    {
      title: "Today's Revenue",
      value: `₹${Number(todayRevenue ?? 0).toFixed(2)}`,
      icon: IndianRupee,
      description: "Total revenue today",
      color: "text-primary",
      role: ["admin"],
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis
        .filter((kpi) => kpi.role.includes(user!.role))
        .map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.title} className="border-border bg-card">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.title}
                </CardTitle>
                <Icon className={cn("h-5 w-5", kpi.color)} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-semibold text-foreground">
                  {kpi.value}
                </div>
                <p className="text-xs text-muted-foreground">
                  {kpi.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
    </div>
  );
}
