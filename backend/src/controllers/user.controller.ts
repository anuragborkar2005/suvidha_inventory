import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: username },
  });

  if (existingUser) {
    return res.status(409).json(new ApiError(409, "Username already taken"));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: username,
      email: username,
      role: "STAFF",
      password: hashedPassword,
    },
  });

  return res.json(new ApiResponse(200, user, "User registered successfully"));
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const user = await prisma.user.findUnique({
    where: { email: username },
  });

  if (!user) {
    return res.status(401).json(new ApiError(401, "Invalid credentials"));
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json(new ApiError(401, "Invalid credentials"));
  }

  const accessToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET_KEY!,
    { expiresIn: "12h" }
  );

  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET_KEY!,
    { expiresIn: "7d" }
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({ accessToken });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Successfully logged out"));
};

export const updatePassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json(new ApiError(400, "Password is required"));
  }

  const userId = req.userId;
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  return res.json(new ApiResponse(200, user, "Password updated successfully"));
};
export const addStaff = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json(new ApiError(400, "Name, email, and password are required"));
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(409)
        .json(new ApiError(409, "Email already exists"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STAFF",
      },
    });

    return res
      .status(201)
      .json(new ApiResponse(201, staff, "Staff added successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error"));
  }
};

export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const staff = await prisma.user.findMany({
      where: { role: "STAFF" },
      select: {
        id: true,
        name: true,
        email: true,
        created_at: true,
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, staff, "Fetched all staff successfully"));
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json(new ApiError(500, "Internal server error"));
  }
};
