"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Line,
  LineChart,
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
import { Sale, useSalesStore } from "@/lib/use-sales";

export function MonthlyReport() {
  const sales = useSalesStore((s) => s.sales);

  const monthlyData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return date;
    });

    return last6Months.map((date) => {
      const monthSales = sales.filter((s: Sale) => {
        const saleDate = new Date(s.created_at);
        return (
          saleDate.getMonth() === date.getMonth() &&
          saleDate.getFullYear() === date.getFullYear()
        );
      });

      return {
        month: date.toLocaleDateString("en-US", { month: "short" }),
        revenue: monthSales.reduce(
          (sum, s: Sale) => sum + Number(s.total_price),
          0
        ),
        sales: monthSales.length,
        items: monthSales.reduce((sum, s: Sale) => sum + s.quantity, 0),
      };
    });
  }, [sales]);

  const currentMonthStats = useMemo(() => {
    const now = new Date();
    const monthSales = sales.filter((s: Sale) => {
      const saleDate = new Date(s.created_at);
      return (
        saleDate.getMonth() === now.getMonth() &&
        saleDate.getFullYear() === now.getFullYear()
      );
    });

    return {
      totalSales: monthSales.length,
      totalRevenue: monthSales.reduce(
        (sum, s: Sale) => sum + Number(s.total_price),
        0
      ),
      totalItems: monthSales.reduce((sum, s: Sale) => sum + s.quantity, 0),
      avgSaleValue:
        monthSales.length > 0
          ? monthSales.reduce(
              (sum, s: Sale) => sum + Number(s.total_price),
              0
            ) / monthSales.length
          : 0,
    };
  }, [sales]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">
              This Month&apos;s Sales
            </CardDescription>
            <CardTitle className="text-3xl text-foreground">
              {currentMonthStats.totalSales}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Total transactions</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">
              Monthly Revenue
            </CardDescription>
            <CardTitle className="text-3xl text-foreground">
              ₹{Number(currentMonthStats.totalRevenue).toFixed(2)}
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
              {currentMonthStats.totalItems}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Units sold this month
            </p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardDescription className="text-muted-foreground">
              Avg Sale Value
            </CardDescription>
            <CardTitle className="text-3xl text-foreground">
              ₹{currentMonthStats.avgSaleValue.toFixed(2)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Revenue Trend</CardTitle>
            <CardDescription className="text-muted-foreground">
              Last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: {
                  label: "Revenue",
                  color: "var(--color-chart-1)", // Optional fallback for external usage
                },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="month"
                    className="stroke-muted-foreground text-muted-foreground text-xs"
                  />
                  <YAxis className="stroke-muted-foreground text-muted-foreground text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    className="stroke-[color:var(--color-chart-1)]"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Sales Volume</CardTitle>
            <CardDescription className="text-muted-foreground">
              Last 6 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: {
                  label: "Sales",
                  color: "var(--color-chart-2)", // Optional fallback for external chart config
                },
              }}
              className="h-[250px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-border"
                  />
                  <XAxis
                    dataKey="month"
                    className="stroke-muted-foreground text-muted-foreground text-xs"
                  />
                  <YAxis className="stroke-muted-foreground text-muted-foreground text-xs" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    className="stroke-[color:var(--color-chart-2)]"
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
