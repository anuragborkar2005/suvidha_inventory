import { PrismaClient } from '@prisma/client';
import type { Request, Response } from 'express';
import exceljs from 'exceljs';
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

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const existingSale = await prisma.sale.findFirst({
    where: {
      product_id: Number(product_id),
      created_at: {
        gte: startOfDay,
        lte: endOfDay,
      },
    },
  });

  let sale;

  if (existingSale) {
    sale = await prisma.sale.update({
      where: { id: existingSale.id },
      data: {
        quantity: existingSale.quantity + quantity,
        total_price: Number(existingSale.total_price) + Number(total_price),
        total_cost: Number(existingSale.total_cost) + Number(total_cost),
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

export const exportSalesToExcel = async (req: Request, res: Response) => {
  const sales = await prisma.sale.findMany({
    include: {
      product: true,
    },
  });

  if (!sales || sales.length === 0) {
    return res.json(new ApiError(404, 'No sales data found to export'));
  }

  const workbook = new exceljs.Workbook();
  const worksheet = workbook.addWorksheet('Sales');

  worksheet.columns = [
    { header: 'Sale ID', key: 'id', width: 10 },
    { header: 'Product Name', key: 'product_name', width: 30 },
    { header: 'Quantity Sold', key: 'quantity', width: 15 },
    { header: 'Total Price', key: 'total_price', width: 15 },
    { header: 'Total Cost', key: 'total_cost', width: 15 },
    { header: 'Sale Date', key: 'sale_date', width: 20 },
  ];

  sales.forEach(sale => {
    worksheet.addRow({
      id: sale.id,
      product_name: sale.product.name,
      quantity: sale.quantity,
      total_price: Number(sale.total_price),
      total_cost: Number(sale.total_cost),
      sale_date: sale.created_at,
    });
  });

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
  res.setHeader('Content-Disposition', 'attachment; filename=sales.xlsx');

  await workbook.xlsx.write(res);
  res.end();
};

export const exportSalesToCSV = async (req: Request, res: Response) => {
  const sales = await prisma.sale.findMany({
    include: {
      product: true,
    },
  });

  if (!sales || sales.length === 0) {
    return res.json(new ApiError(404, 'No sales data found to export'));
  }

  const csvData = [
    ['Sale ID', 'Product Name', 'Quantity Sold', 'Total Price', 'Total Cost', 'Sale Date'],
    ...sales.map(sale => [
      sale.id,
      sale.product.name,
      sale.quantity,
      Number(sale.total_price),
      Number(sale.total_cost),
      sale.created_at,
    ]),
  ]
    .map(row => row.join(','))
    .join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=sales.csv');
  res.send(csvData);
};
