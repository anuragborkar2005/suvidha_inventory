"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSales } from "@/lib/use-sales";
import { useProducts } from "@/lib/use-products";

export function RecentSales() {
  const { sales } = useSales();
  const { products } = useProducts();

  const recentSales = sales.slice(0, 5);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Sales</CardTitle>
        <CardDescription className="text-muted-foreground">
          Latest transactions in your shop
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSales.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sales recorded yet
            </p>
          ) : (
            recentSales.map((sale) => {
              const product = products.find((p) => p.id === sale.product_id);
              return (
                <div
                  key={sale.id}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {product?.name || "Unknown Product"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {sale.quantity} × ${sale.pricePerUnit.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      ${sale.total_price.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(sale.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
