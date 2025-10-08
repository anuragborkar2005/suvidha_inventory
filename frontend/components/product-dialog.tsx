"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useProducts, type Product } from "@/lib/use-products";
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

interface ProductDialogProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function ProductDialog({
  isOpen,
  onClose,
  product,
}: ProductDialogProps) {
  const { addProduct, updateProduct } = useProducts();
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    cost_price: "",
    selling_price: "",
    stock_quantity: "",
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        cost_price: product.cost_price.toString(),
        selling_price: product.selling_price.toString(),
        stock_quantity: product.stock_quantity.toString(),
      });
    } else {
      setFormData({
        name: "",
        category: "",
        cost_price: "",
        selling_price: "",
        stock_quantity: "",
      });
    }
  }, [product, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const productData = {
      name: formData.name,
      category: formData.category,
      cost_price: Number.parseFloat(formData.cost_price),
      selling_price: Number.parseFloat(formData.selling_price),
      stock_quantity: Number.parseInt(formData.stock_quantity),
    };

    if (product) {
      updateProduct(product.id, productData);
    } else {
      addProduct(productData);
    }

    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="border-border bg-card sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {product
              ? "Update the product details below."
              : "Fill in the details to add a new product."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="bg-secondary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              required
              className="bg-secondary"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost_price">Cost Price ($)</Label>
              <Input
                id="cost_price"
                type="number"
                step="0.01"
                value={formData.cost_price}
                onChange={(e) =>
                  setFormData({ ...formData, cost_price: e.target.value })
                }
                required
                className="bg-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="selling_price">Selling Price ($)</Label>
              <Input
                id="selling_price"
                type="number"
                step="0.01"
                value={formData.selling_price}
                onChange={(e) =>
                  setFormData({ ...formData, selling_price: e.target.value })
                }
                required
                className="bg-secondary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stock_quantity">Stock Quantity</Label>
            <Input
              id="stock_quantity"
              type="number"
              value={formData.stock_quantity}
              onChange={(e) =>
                setFormData({ ...formData, stock_quantity: e.target.value })
              }
              required
              className="bg-secondary"
            />
          </div>

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
              {product ? "Update Product" : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
