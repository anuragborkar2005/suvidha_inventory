"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProductStore } from "@/lib/use-products";
import { Sale, useSalesStore } from "@/lib/use-sales";

export function RecentSales() {
  const sales = useSalesStore((s) => s.sales);
  const products = useProductStore((s) => s.products);

  const recentSales = sales.slice(0, 5);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Sales</CardTitle>
        <CardDescription className="text-muted-foreground">
          Latest transactions in your Suvidha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSales.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sales recorded yet
            </p>
          ) : (
            recentSales.map((sale: Sale) => {
              const product = products.find(
                (p) => p.id === Number(sale.product_id)
              );
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
                      {sale?.product?.selling_price !== undefined
                        ? `${
                            sale.quantity
                          } × ₹${sale.product?.selling_price.toFixed(2)}`
                        : "Price unavailable"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      ₹{Number(sale.total_price ?? 0).toFixed(2)}
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
