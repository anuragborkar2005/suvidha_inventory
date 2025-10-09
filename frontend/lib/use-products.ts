"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/services/api";

export interface Product {
  id: number;
  name: string;
  category: string;
  cost_price: number;
  selling_price: number;
  profit: number;
  stock_quantity: number;
  created_at: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await api.get("/product/all");
      setProducts(response.data.data);
      // console.log("Products fetched successfully ", response.data.data);
    } catch (error) {
      console.error("Failed to fetch products", error);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const addProduct = async (product: Omit<Product, "id" | "created_at">) => {
    try {
      await api.post("/product", product);
      fetchProducts();
      console.log("Product added successfully");
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    try {
      await api.patch(`/product/${id}`, updates);
      fetchProducts();
    } catch (error) {
      console.error("Failed to update product", error);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await api.delete(`/product/${id}`);
      fetchProducts();
    } catch (error) {
      console.error("Failed to delete product", error);
    }
  };

  return { products, addProduct, updateProduct, deleteProduct, fetchProducts };
}
