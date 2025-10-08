"use client";

import { useMemo, useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export function ProductPerformance() {
  const { sales } = useSales();
  const { products } = useProducts();
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  useEffect(() => {
    const settings = localStorage.getItem("shop-settings");
    if (settings) {
      const parsed = JSON.parse(settings);
      setLowStockThreshold(parsed.lowStockThreshold || 10);
    }
  }, []);

  const productStats = useMemo(() => {
    return products
      .map((product) => {
        const productSales = sales.filter((s) => s.product_id === product.id);
        const totalRevenue = productSales.reduce(
          (sum, s) => sum + s.total_price,
          0
        );
        const totalQuantity = productSales.reduce(
          (sum, s) => sum + s.quantity,
          0
        );

        return {
          id: product.id,
          name: product.name,
          category: product.category,
          totalSales: productSales.length,
          totalRevenue,
          totalQuantity,
          currentStock: product.stock_quantity,
          isLowStock: product.stock_quantity <= lowStockThreshold,
        };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [products, sales, lowStockThreshold]);

  const topPerformers = productStats.slice(0, 3);
  const totalRevenue = productStats.reduce((sum, p) => sum + p.totalRevenue, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {topPerformers.map((product, index) => (
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
                  ${product.totalRevenue.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Units Sold:</span>
                <span className="font-semibold text-foreground">
                  {product.totalQuantity}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
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
                <TableHead className="text-muted-foreground">
                  Sales Count
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Units Sold
                </TableHead>
                <TableHead className="text-muted-foreground">Revenue</TableHead>
                <TableHead className="text-muted-foreground">Stock</TableHead>
                <TableHead className="text-muted-foreground">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productStats.map((product) => {
                const revenueShare =
                  totalRevenue > 0
                    ? (product.totalRevenue / totalRevenue) * 100
                    : 0;

                return (
                  <TableRow key={product.id} className="border-border">
                    <TableCell className="font-medium text-foreground">
                      {product.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {product.category}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {product.totalSales}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {product.totalQuantity}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      ${product.totalRevenue.toFixed(2)}
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
                    <TableCell className="text-foreground">
                      {revenueShare.toFixed(1)}%
                    </TableCell>
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
