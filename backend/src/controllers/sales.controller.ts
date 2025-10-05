import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const prisma = new PrismaClient();

export const addSales = async (req: Request, res: Response) => {
  const { product_id, quantity, total_price, total_cost } = req.body;

  if (!product_id || !quantity || !total_price || !total_cost) {
    return res.json(new ApiError(400, 'All fields are required to record a sale'));
  }

  const product = await prisma.product.findUnique({
    where: { id: Number(product_id) },
  });

  if (!product) {
    return res.json(new ApiError(404, 'Product not found'));
  }

  if (product.stock_quantity < quantity) {
    return res.json(
      new ApiError(400, `Insufficient stock. Only ${product.stock_quantity} units available.`)
    );
  }

  const existingSale = await prisma.sale.findFirst({
    where: { product_id: Number(product_id) },
  });

  let sale;

  if (existingSale) {
    sale = await prisma.sale.update({
      where: { id: existingSale.id },
      data: {
        quantity: existingSale.quantity + quantity,
        total_price: existingSale.total_price + total_price,
        total_cost: existingSale.total_cost + total_cost,
      },
    });
  } else {
    sale = await prisma.sale.create({
      data: {
        product_id: Number(product_id),
        quantity,
        total_price,
        total_cost,
      },
    });
  }

  await prisma.product.update({
    where: { id: Number(product_id) },
    data: {
      stock_quantity: product.stock_quantity - quantity,
    },
  });

  return res.json(new ApiResponse(200, sale, 'Sale recorded and stock updated successfully'));
};
export const getSales = async (req: Request, res: Response) => {
  const sales = await prisma.sale.findMany();
  if (!sales) {
    return res.json(new ApiError(404, 'Sales not found'));
  }
  return res.json(new ApiResponse(200, sales, 'Sales fetched successfully'));
};
