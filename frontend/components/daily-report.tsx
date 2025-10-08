"use client";

import { useMemo } from "react";
import { useSales } from "@/lib/use-sales";
import { useProducts } from "@/lib/use-products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function DailyReport() {
  const { sales } = useSales();
  const { products } = useProducts();

  const dailyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date;
    });

    return last7Days.map((date) => {
      const dateStr = date.toDateString();
      const daySales = sales.filter(
        (s) => new Date(s.created_at).toDateString() === dateStr
      );

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: daySales.reduce((sum, s) => sum + s.total_price, 0),
        sales: daySales.length,
      };
    });
  }, [sales]);

  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todaySales = sales.filter(
      (s) => new Date(s.created_at).toDateString() === today
    );

    return {
      totalSales: todaySales.length,
      totalRevenue: todaySales.reduce((sum, s) => sum + s.total_price, 0),
      totalItems: todaySales.reduce((sum, s) => sum + s.quantity, 0),
      avgSaleValue:
        todaySales.length > 0
          ? todaySales.reduce((sum, s) => sum + s.total_price, 0) /
            todaySales.length
          : 0,
    };
  }, [sales]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">
              Today's Sales
            </CardDescription>
            <CardTitle className="text-3xl text-foreground">
              {todayStats.totalSales}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Total transactions</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">
              Today's Revenue
            </CardDescription>
            <CardTitle className="text-3xl text-foreground">
              ${todayStats.totalRevenue.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Total earnings</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">
              Items Sold
            </CardDescription>
            <CardTitle className="text-3xl text-foreground">
              {todayStats.totalItems}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Units sold today</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">
              Avg Sale Value
            </CardDescription>
            <CardTitle className="text-3xl text-foreground">
              ${todayStats.avgSaleValue.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">Last 7 Days Revenue</CardTitle>
          <CardDescription className="text-muted-foreground">
            Daily revenue trend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              revenue: {
                label: "Revenue",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="hsl(var(--border))"
                />
                <XAxis
                  dataKey="date"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="revenue"
                  fill="hsl(var(--chart-1))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
