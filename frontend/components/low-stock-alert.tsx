"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProducts } from "@/lib/use-products";
import { AlertTriangle } from "lucide-react";

export function LowStockAlert() {
  const { products } = useProducts();
  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  useEffect(() => {
    const settings = localStorage.getItem("shop-settings");
    if (settings) {
      const parsed = JSON.parse(settings);
      setLowStockThreshold(parsed.lowStockThreshold || 10);
    }
  }, []);

  const lowStockProducts = products
    .filter((p) => p.stock_quantity <= lowStockThreshold)
    .slice(0, 5);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          Low Stock Alert
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Products that need restocking
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              All products are well stocked
            </p>
          ) : (
            lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {product.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {product.category}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="destructive" className="mb-1">
                    {product.stock_quantity} left
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Threshold: {lowStockThreshold}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
