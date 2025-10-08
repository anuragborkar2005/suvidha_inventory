"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useProducts } from "@/lib/use-products";
import { useSales } from "@/lib/use-sales";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

interface RecordSaleDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

function getUserId(username: string): number {
  return username === "admin" ? 1 : 2;
}

export function RecordSaleDialog({ isOpen, onClose }: RecordSaleDialogProps) {
  const { user } = useAuth();
  const { products, updateProduct } = useProducts();
  const { addSale } = useSales();

  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  const [lowStockThreshold, setLowStockThreshold] = useState(10);

  useEffect(() => {
    const stored = localStorage.getItem("shop_settings");
    if (stored) {
      const settings = JSON.parse(stored);
      setLowStockThreshold(settings.lowStockThreshold || 10);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setSelectedProductId("");
      setQuantity("");
      setError("");
    }
  }, [isOpen]);

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedProduct) {
      setError("Please select a product");
      return;
    }

    const qty = Number.parseInt(quantity);

    if (qty <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }

    if (qty > selectedProduct.stock_quantity) {
      setError(
        `Insufficient stock. Only ${selectedProduct.stock_quantity} units available.`
      );
      return;
    }

    const total_price = selectedProduct.selling_price * qty;
    const total_cost = selectedProduct.cost_price * qty;
    const profit = total_price - total_cost;

    // Record the sale
    addSale({
      product_id: selectedProduct.id,
      quantity: qty,
      pricePerUnit: selectedProduct.selling_price,
      total_price,
      total_cost,
      profit,
      sold_by: getUserId(user?.username || "staff"),
      created_at: new Date().toISOString(),
    });

    // Update product stock
    updateProduct(selectedProduct.id, {
      stock_quantity: selectedProduct.stock_quantity - qty,
    });

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-card sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">Record Sale</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Select a product and enter the quantity sold
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="product">Product</Label>
            <Select
              value={selectedProductId}
              onValueChange={setSelectedProductId}
            >
              <SelectTrigger id="product" className="bg-secondary">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent className="border-border bg-popover">
                {products.map((product) => (
                  <SelectItem
                    key={product.id}
                    value={product.id}
                    className="hover:bg-accent"
                  >
                    {product.name} - ${(product.selling_price ?? 0).toFixed(2)}{" "}
                    ({product.stock_quantity ?? 0} in stock)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedProduct && (
            <div className="rounded-lg bg-muted p-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Available Stock:</span>
                <span className="font-medium text-foreground">
                  {selectedProduct.stock_quantity ?? 0} units
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Price per Unit:</span>
                <span className="font-medium text-foreground">
                  ${(selectedProduct.selling_price ?? 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Profit per Unit:</span>
                <span className="font-medium text-chart-2">
                  $
                  {(
                    (selectedProduct.selling_price ?? 0) -
                    (selectedProduct.cost_price ?? 0)
                  ).toFixed(2)}
                </span>
              </div>
              {selectedProduct.stock_quantity <= lowStockThreshold && (
                <Alert variant="destructive" className="mt-2">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Low stock warning
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              className="bg-secondary"
              placeholder="Enter quantity"
            />
          </div>

          {selectedProduct && quantity && Number.parseInt(quantity) > 0 && (
            <div className="rounded-lg bg-accent/10 p-3 border border-accent/20 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-foreground">
                  Total Amount:
                </span>
                <span className="text-xl font-semibold text-accent-foreground">
                  $
                  {(
                    (selectedProduct.selling_price ?? 0) *
                    Number.parseInt(quantity)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Profit:</span>
                <span className="font-semibold text-chart-2">
                  $
                  {(
                    ((selectedProduct.selling_price ?? 0) -
                      (selectedProduct.cost_price ?? 0)) *
                    Number.parseInt(quantity)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              Record Sale
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
