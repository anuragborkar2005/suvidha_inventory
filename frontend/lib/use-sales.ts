"use client";

import api from "@/services/api";
import { Product } from "./use-products";
import { create } from "zustand";

export interface Sale {
  id: string;
  product_id: string;
  quantity: number;
  total_price: number;
  total_cost: number;
  product?: Product; // optional for safety
  sold_by: string;
  created_at: string;
}

interface SalesState {
  sales: Sale[];
  fetchSales: () => Promise<void>;
  addSales: (sale: Omit<Sale, "id">) => Promise<void>;
  getTotalRevenue: () => number;
  getTodayRevenue: () => number;
  getTodayProfit: () => number;
  getRevenueByDateRange: (startDate: Date, endDate: Date) => number;
  getSalesByDateRange: (startDate: Date, endDate: Date) => Sale[];
}

export const useSalesStore = create<SalesState>((set, get) => ({
  sales: [],
  fetchSales: async () => {
    try {
      const response = await api.get("/sales");
      set({ sales: response.data.data });
    } catch (err) {
      console.error("Failed to fetch sales:", err);
    }
  },
  addSales: async (sale) => {
    try {
      console.log("Adding Sales", sale);
      await api.post("/sales", sale);
      get().fetchSales();
    } catch (err) {
      console.error("Failed to add sale:", err);
      throw err;
    }
  },
  getTotalRevenue: () => {
    return get().sales.reduce((sum, s: Sale) => sum + Number(s.total_price), 0);
  },
  getTodayRevenue: () => {
    const today = new Date().toDateString();
    return get()
      .sales.filter((s) => new Date(s.created_at).toDateString() === today)
      .reduce((sum, s) => sum + Number(s.total_price), 0);
  },
  getTodayProfit: () => {
    const today = new Date().toDateString();
    return get()
      .sales.filter((s) => new Date(s.created_at).toDateString() === today)
      .reduce((sum, s) => {
        const profit = Number(s.total_price) - Number(s.total_cost);
        return sum + profit;
      }, 0);
  },
  getRevenueByDateRange: (startDate: Date, endDate: Date) => {
    return get()
      .sales.filter((s) => {
        const saleDate = new Date(s.created_at);
        return saleDate >= startDate && saleDate <= endDate;
      })
      .reduce((sum, s) => sum + Number(s.total_price), 0);
  },
  getSalesByDateRange: (startDate: Date, endDate: Date) => {
    return get().sales.filter((s) => {
      const saleDate = new Date(s.created_at);
      return saleDate >= startDate && saleDate <= endDate;
    });
  },
}));
