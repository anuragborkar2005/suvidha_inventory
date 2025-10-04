import type { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

const prisma = PrismaClient();

export const verifyJwt = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders?.startsWith("Bearer ")) {
    return res.json(new ApiResponse(401, null, "Unauthorized"));
  }

  const token = authHeaders.split(" ")[1];
  jwt.verify(token!, process.env.JWT_SECRET_KEY!, (err, decoded) => {
    if (err) {
      return res.json(new ApiResponse(403, null, "Forbidden"));
    }
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded
    ) {
      req.userId = (decoded as jwt.JwtPayload).userId;
    }
    next();
  });
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders?.startsWith("Bearer ")) {
    return res.json(new ApiResponse(401, null, "Unauthorized"));
  }

  const token = authHeaders.split(" ")[1];
  jwt.verify(token!, process.env.JWT_SECRET_KEY!, (err, decoded) => {
    if (err) {
      return res.json(new ApiResponse(403, null, "Forbidden"));
    }
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded
    ) {
      const userId = (decoded as jwt.JwtPayload).userId;
      const role = prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      if (role === "ADMIN") {
        next();
      } else {
        return res.json(new ApiResponse(403, null, "Forbidden"));
      }
    }
  });
};

export const staffOnly = (req: Request, res: Response, next: NextFunction) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders?.startsWith("Bearer ")) {
    return res.json(new ApiResponse(401, null, "Unauthorized"));
  }

  const token = authHeaders.split(" ")[1];
  jwt.verify(token!, process.env.JWT_SECRET_KEY!, (err, decoded) => {
    if (err) {
      return res.json(new ApiResponse(403, null, "Forbidden"));
    }
    if (
      typeof decoded === "object" &&
      decoded !== null &&
      "userId" in decoded
    ) {
      const userId = (decoded as jwt.JwtPayload).userId;
      const role = prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      if (role === "STAFF") {
        next();
      } else {
        return res.json(new ApiResponse(403, null, "Forbidden"));
      }
    }
    next();
  });
};
