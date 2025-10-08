"use client";

import { useState, useEffect } from "react";

export interface Sale {
  id: string;
  product_id: string;
  quantity: number;
  pricePerUnit: number;
  total_price: number;
  total_cost: number;
  profit: number;
  sold_by: number;
  created_at: string;
}

const INITIAL_SALES: Sale[] = [
  {
    id: "1",
    product_id: "1",
    quantity: 2,
    pricePerUnit: 29.99,
    total_price: 59.98,
    total_cost: 30.0,
    profit: 29.98,
    sold_by: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    product_id: "3",
    quantity: 5,
    pricePerUnit: 9.99,
    total_price: 49.95,
    total_cost: 20.0,
    profit: 29.95,
    sold_by: 1,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    product_id: "2",
    quantity: 3,
    pricePerUnit: 4.99,
    total_price: 14.97,
    total_cost: 7.5,
    profit: 7.47,
    sold_by: 2,
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("shop_sales");
    if (stored) {
      setSales(JSON.parse(stored));
    } else {
      setSales(INITIAL_SALES);
      localStorage.setItem("shop_sales", JSON.stringify(INITIAL_SALES));
    }
  }, []);

  const addSale = (sale: Omit<Sale, "id">) => {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
    };
    const updated = [newSale, ...sales];
    setSales(updated);
    localStorage.setItem("shop_sales", JSON.stringify(updated));
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
      .reduce((sum, s) => sum + s.profit, 0);
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
    addSale,
    getTodayRevenue,
    getTodayProfit,
    getRevenueByDateRange,
    getSalesByDateRange,
  };
}
