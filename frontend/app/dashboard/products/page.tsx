"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { ProductsTable } from "@/components/products-table";
import { ProductDialog } from "@/components/product-dialog";
import type { Product } from "@/lib/use-products";

export default function ProductsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Products
            </h1>
            <p className="text-muted-foreground">
              Manage your product inventory
            </p>
          </div>
          <Button
            onClick={handleAddProduct}
            className="gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary"
            />
          </div>
        </div>

        <ProductsTable searchQuery={searchQuery} onEdit={handleEditProduct} />

        <ProductDialog
          isOpen={isDialogOpen}
          onClose={handleCloseDialog}
          product={editingProduct}
        />
      </div>
    </ProtectedRoute>
  );
}
