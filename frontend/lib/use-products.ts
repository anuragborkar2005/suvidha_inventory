"use client";

import api from "@/services/api";
import { create } from "zustand";

export interface Product {
  id: number;
  name: string;
  category: string;
  cost_price: number;
  selling_price: number;
  profit: number;
  stock_quantity: number;
  stock_threshold: number;
  created_at: string;
}

interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, "id" | "created_at">) => Promise<void>;
  updateProduct: (id: number, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  updateStockThreshold: (id: number, stock_threshold: number) => Promise<void>;
  fetchProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  addProduct: async (product) => {
    try {
      await api.post("/product", product);
      console.log("Product added successfully");
      get().fetchProducts();
    } catch (error) {
      console.error("Failed to add product", error);
    }
  },
  updateProduct: async (id, updates) => {
    try {
      await api.patch(`/product/${id}`, updates);
      get().fetchProducts();
    } catch (error) {
      console.error("Failed to update product", error);
    }
  },
  deleteProduct: async (id) => {
    try {
      await api.delete(`/product/${id}`);
      get().fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  },
  updateStockThreshold: async (id, stock_threshold) => {
    try {
      await api.patch(`/product/threshold/${id}`, { stock_threshold });
      get().fetchProducts();
    } catch (error) {
      console.error("Failed to update stock threshold", error);
    }
  },
  fetchProducts: async () => {
    try {
      const response = await api.get("/product/all");
      set({ products: response.data.data });
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  },
}));
