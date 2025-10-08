"use client";

import api from "@/services/api";
import { useState, useEffect, useCallback } from "react";
import { Product } from "./use-products";

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

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/sales");
      setSales(response.data.data);
    } catch (err) {
      const typedError = err as Error;
      setError(typedError);
      console.error("Failed to fetch sales:", typedError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  const addSale = async (sale: Omit<Sale, "id">) => {
    try {
      await api.post("/sales", sale);
      fetchSales();
      fetchSales();
    } catch (err) {
      console.error(" Failed to add sale:", err);
    }
  };

  const getTodayRevenue = () => {
    const today = new Date().toDateString();
    return sales
      .filter((s) => new Date(s.created_at).toDateString() === today)
      .reduce((sum, s) => sum + s.total_price, 0);
  };

  const getTodayProfit = () => {
    const today = new Date().toDateString();
    return sales
      .filter((s) => new Date(s.created_at).toDateString() === today)
      .reduce((sum, s) => {
        const profit = s.total_price - s.total_cost;
        return sum + profit;
      }, 0);
  };

  const getRevenueByDateRange = (startDate: Date, endDate: Date) => {
    return sales
      .filter((s) => {
        const saleDate = new Date(s.created_at);
        return saleDate >= startDate && saleDate <= endDate;
      })
      .reduce((sum, s) => sum + s.total_price, 0);
  };

  const getSalesByDateRange = (startDate: Date, endDate: Date) => {
    return sales.filter((s) => {
      const saleDate = new Date(s.created_at);
      return saleDate >= startDate && saleDate <= endDate;
    });
  };

  return {
    sales,
    loading,
    error,
    addSale,
    getTodayRevenue,
    getTodayProfit,
    getRevenueByDateRange,
    getSalesByDateRange,
  };
}
