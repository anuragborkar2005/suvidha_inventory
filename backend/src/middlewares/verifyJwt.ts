import type { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders?.startsWith("Bearer ")) {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  }

  const token = authHeaders.split(" ")[1];
  try {
    const decoded = jwt.verify(token!, process.env.JWT_SECRET_KEY!);
    if (typeof decoded === "object" && decoded !== null && "userId" in decoded) {
      req.userId = (decoded as jwt.JwtPayload).userId;
    }
    next();
  } catch (err) {
    return res.status(403).json(new ApiResponse(403, null, "Forbidden"));
  }
};

export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));

    const user = await prisma.user.findUnique({
      where: { id: Number(req.userId) },
      select: { role: true },
    });

    if (!user || user.role !== "ADMIN") {
      return res.status(403).json(new ApiResponse(403, null, "Admin access only"));
    }

    next();
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, "Server error"));
  }
};

export const staffOnly = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));

    const user = await prisma.user.findUnique({
      where: { id: Number(req.userId) },
      select: { role: true },
    });

    if (!user || user.role !== "STAFF") {
      return res.status(403).json(new ApiResponse(403, null, "Staff access only"));
    }

    next();
  } catch (error) {
    return res.status(500).json(new ApiResponse(500, null, "Server error"));
  }
};
