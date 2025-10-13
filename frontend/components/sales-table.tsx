"use client";

import { useProductStore } from "@/lib/use-products";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/lib/auth-context";
import { Sale, useSalesStore } from "@/lib/use-sales";

interface SalesTableProps {
  filter: "all" | "today" | "week";
}

export function SalesTable({ filter }: SalesTableProps) {
  const sales = useSalesStore((s) => s.sales);
  const products = useProductStore((s) => s.products);
  const { user } = useAuth();

  const filteredSales = sales.filter((sale: Sale) => {
    const saleDate = new Date(sale.created_at);
    const now = new Date();

    if (filter === "today") {
      return saleDate.toDateString() === now.toDateString();
    }

    if (filter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return saleDate >= weekAgo;
    }

    return true;
  });
  console.log(filteredSales);

  const totalRevenue = filteredSales.reduce((sum, sale: Sale) => {
    const product = products.find((p) => p.id === Number(sale.product_id));
    return sum + (product?.selling_price ?? 0) * (sale.quantity ?? 0);
  }, 0);
  const totalItems = filteredSales.reduce(
    (sum, sale: Sale) => sum + sale.quantity,
    0
  );

  return (
    <div className="space-y-4 ">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Sales</p>
          <p className="text-2xl font-semibold text-foreground">
            {filteredSales.length}
          </p>
        </Card>
        <Card className="border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Items Sold</p>
          <p className="text-2xl font-semibold text-foreground">{totalItems}</p>
        </Card>
        {user?.role == "admin" && (
          <Card className="border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-2xl font-semibold text-foreground">
              ₹{Number(totalRevenue ?? 0).toFixed(2)}
            </p>
          </Card>
        )}
      </div>

      <Card className="border-border bg-card px-4 py-4">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">
                Date & Time
              </TableHead>
              <TableHead className="text-muted-foreground">Product</TableHead>
              <TableHead className="text-muted-foreground">Quantity</TableHead>
              <TableHead className="text-muted-foreground">
                Price/Unit
              </TableHead>
              <TableHead className="text-muted-foreground">
                Total Sale
              </TableHead>
              {/* <TableHead className="text-muted-foreground">Sold By</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-muted-foreground"
                >
                  No sales found for this period
                </TableCell>
              </TableRow>
            ) : (
              filteredSales.map((sale: Sale) => {
                const product = products.find((p) => {
                  return p.id === Number(sale.product_id);
                });
                const saleDate = new Date(sale.created_at);
                const total_sale =
                  (product?.selling_price ?? 0) * (sale.quantity ?? 0);

                return (
                  <TableRow key={sale.id} className="border-border">
                    <TableCell className="text-foreground">
                      <div className="space-y-1">
                        <p className="font-medium">
                          {saleDate.toLocaleDateString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {saleDate.toLocaleTimeString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      {product?.name || "Unknown Product"}
                    </TableCell>
                    <TableCell className="text-foreground">
                      {sale.quantity}
                    </TableCell>
                    <TableCell className="text-foreground">
                      ₹{(product?.selling_price ?? 0).toFixed(2)}
                    </TableCell>
                    <TableCell className="font-semibold text-foreground">
                      ₹{Number(total_sale).toFixed(2)}
                    </TableCell>
                    {/* <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {sale.sold_by}
                      </Badge>
                    </TableCell> */}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
