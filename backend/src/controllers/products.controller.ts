import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/ApiError.js';
import type { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse.js';

const prisma = new PrismaClient();

export const addProduct = async (req: Request, res: Response) => {
  const { name, stock_quantity, cost_price, selling_price } = req.body;
  if (!name || !stock_quantity || !cost_price || !selling_price) {
    return res.json(new ApiError(201, 'All fields are required'));
  }
  const product = await prisma.product.create({
    data: {
      name: name,
      cost_price: cost_price,
      selling_price: selling_price,
      stock_quantity: stock_quantity,
      profit: selling_price - cost_price,
      created_at: new Date().toISOString(),
    },
  });

  if (!product) {
    return res.json(new ApiError(404, 'Product not found'));
  }
  return res.json(new ApiResponse(200, product, 'Product added successfully'));
};
export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, stock_quantity, cost_price, selling_price } = req.body;

  if (!name || !stock_quantity || !cost_price || !selling_price) {
    return res.json(new ApiError(201, 'All fields are required'));
  }
  const product = await prisma.product.update({
    where: {
      id: Number(id),
    },

    data: {
      name: name,
      cost_price: cost_price,
      selling_price: selling_price,
      stock_quantity: stock_quantity,
      profit: selling_price - cost_price,
      updated_at: new Date().toISOString(),
    },
  });

  if (!product) {
    return res.json(new ApiError(404, 'Product not found'));
  } else {
    return res.json(new ApiResponse(200, product, 'Product updated successfully'));
  }
};
export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.delete({
    where: {
      id: Number(id),
    },
  });
  if (!product) {
    return res.json(new ApiError(404, 'Product not found'));
  }

  return res.json(new ApiResponse(200, product, 'Product deleted successfully'));
};
export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!product) {
    return res.json(new ApiError(404, 'Product not found'));
  }

  return res.json(new ApiResponse(200, product, 'Product fetched successfully'));
};
export const getProducts = async (req: Request, res: Response) => {
  const products = await prisma.product.findMany();
  if (!products) {
    return res.json(new ApiError(404, 'Products not found'));
  }
  return res.json(new ApiResponse(200, products, 'Products fetched successfully'));
};
