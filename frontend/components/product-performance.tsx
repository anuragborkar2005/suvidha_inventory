"use client";

import { useMemo } from "react";
import { useProductStore } from "@/lib/use-products";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { Sale, useSalesStore } from "@/lib/use-sales";

export function ProductPerformance() {
  const sales = useSalesStore((s) => s.sales);
  const products = useProductStore((s) => s.products);

  const getInitialThreshold = () => {
    // Check if window is defined for server-side rendering (SSR) compatibility
    if (typeof window === "undefined") {
      return 10;
    }
    const settings = localStorage.getItem("shop_settings");
    if (settings) {
      const parsed = JSON.parse(settings);
      return parsed.lowStockThreshold || 10;
    }
    return 10;
  };

  const lowStockThreshold = getInitialThreshold();

  const productStats = useMemo(() => {
    const salesByProductId = new Map();
    sales.forEach((sale: Sale) => {
      const productId = sale.product_id;
      const stats = salesByProductId.get(productId) || {
        totalRevenue: 0,
        totalQuantity: 0,
        totalSales: 0,
      };
      stats.totalRevenue += Number(sale.total_price);
      stats.totalQuantity += Number(sale.quantity);
      stats.totalSales += 1;
      salesByProductId.set(productId, stats);
    });

    return products
      .map((product) => {
        const stats = salesByProductId.get(String(product.id)) || {
          totalRevenue: 0,
          totalQuantity: 0,
          totalSales: 0,
        };
        console.log(stats);
        return {
          id: product.id,
          name: product.name,
          category: product.category,
          totalSales: stats.totalSales,
          totalRevenue: stats.totalRevenue,
          totalQuantity: stats.totalQuantity,
          currentStock: product.stock_quantity,
          isLowStock: product.stock_quantity <= lowStockThreshold,
        };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [products, sales, lowStockThreshold]);

  const topPerformers = productStats.slice(0, 3);
  // const totalRevenue = productStats.reduce(
  //   (sum, p) => sum + Number(p.totalRevenue),
  //   0
  // );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {topPerformers.map((product, index) => {
          const productSales = sales.filter(
            (s: Sale) => Number(s.product_id) === product.id
          );
          return (
            <Card key={product.id} className="border-border bg-card">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-muted-foreground">
                    #{index + 1} Top Performer
                  </CardDescription>
                  <TrendingUp className="h-4 w-4 text-chart-2" />
                </div>
                <CardTitle className="text-xl text-foreground">
                  {product.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Revenue:</span>
                  <span className="font-semibold text-foreground">
                    ₹
                    {productSales
                      .reduce((sum, s: Sale) => sum + Number(s.total_price), 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Units Sold:</span>
                  <span className="font-semibold text-foreground">
                    {productSales.reduce(
                      (sum, s: Sale) => sum + Number(s.quantity),
                      0
                    )}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-foreground">
            All Products Performance
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Detailed breakdown of product sales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">
                  Category
                </TableHead>
                {/* <TableHead className="text-muted-foreground">
                  Sales Count
                </TableHead> */}
                <TableHead className="text-muted-foreground">
                  Units Sold
                </TableHead>
                <TableHead className="text-muted-foreground">Revenue</TableHead>
                <TableHead className="text-muted-foreground">Stock</TableHead>
                {/* <TableHead className="text-muted-foreground">Share</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {productStats.map((product) => {
                const productSales = sales.filter(
                  (s: Sale) => Number(s.product_id) === product.id
                );

                // const revenue = productSales.reduce(
                //   (sum, s) => sum + Number(s.total_price),
                //   0
                // );

                // const revenueShare =
                //   totalRevenue > 0 ? (revenue / totalRevenue) * 100 : 0;

                return (
                  <TableRow key={product.id} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.category}
                    </TableCell>
                    {/* <TableCell className="text-foreground">
                      {product.totalSales}
                    </TableCell> */}
                    <TableCell className="text-foreground">
                      {productSales.reduce(
                        (sum, s: Sale) => sum + Number(s.quantity),
                        0
                      )}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      ₹
                      {productSales
                        .reduce(
                          (sum, s: Sale) => sum + Number(s.total_price),
                          0
                        )
                        .toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          product.isLowStock ? "destructive" : "secondary"
                        }
                      >
                        {product.currentStock}
                      </Badge>
                    </TableCell>
                    {/* <TableCell className="text-foreground">
                      {revenueShare.toFixed(1)}%
                    </TableCell> */}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
