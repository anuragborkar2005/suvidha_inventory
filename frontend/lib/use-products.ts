"use client";

import { useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  category: string;
  cost_price: number;
  selling_price: number;
  stock_quantity: number;
  created_at: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Wireless Mouse",
    category: "Electronics",
    cost_price: 15.0,
    selling_price: 29.99,
    stock_quantity: 45,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Notebook A4",
    category: "Stationery",
    cost_price: 2.5,
    selling_price: 4.99,
    stock_quantity: 8,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "USB Cable",
    category: "Electronics",
    cost_price: 4.0,
    selling_price: 9.99,
    stock_quantity: 120,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Desk Lamp",
    category: "Furniture",
    cost_price: 18.0,
    selling_price: 34.99,
    stock_quantity: 5,
    created_at: new Date().toISOString(),
  },
];

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("shop_products");
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem("shop_products", JSON.stringify(INITIAL_PRODUCTS));
    }
  }, []);

  const addProduct = (product: Omit<Product, "id" | "created_at">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem("shop_products", JSON.stringify(updated));
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    setProducts(updated);
    localStorage.setItem("shop_products", JSON.stringify(updated));
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("shop_products", JSON.stringify(updated));
  };

  return { products, addProduct, updateProduct, deleteProduct };
}
