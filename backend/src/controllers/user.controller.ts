import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { ApiResponse } from '../utils/ApiResponse.js';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json(new ApiError(201, 'All fields are required'));
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: username },
  });

  if (existingUser) {
    throw new ApiError(409, 'Username already taken');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: username,
      email: username,
      role: Role.STAFF,
      password: hashedPassword,
    },
  });

  return res.json(new ApiResponse(200, user, 'User registered successfully'));
};

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.json(new ApiError(201, 'All fields are required'));
  }

  const user = await prisma.user.findUnique({
    where: { email: username },
  });

  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: '12h',
  });

  const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY!, {
    expiresIn: '7d',
  });

  await prisma.user.update({
    where: { id: user.id },
    data: {
      refreshToken,
    },
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  return res.json({ accessToken });
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  return res.status(200).json(new ApiResponse(200, null, 'Successfully logged out'));
};

export const updatePassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  if (!password) {
    return res.json(new ApiError(201, 'Password is required'));
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userId = req.userId;
  const user = await prisma.user.update({
    where: { id: Number(userId) },
    data: {
      password: hashedPassword,
    },
  });

  if (!user) {
    return res.json(new ApiError(404, 'User not found'));
  }

  return res.json(new ApiResponse(200, user, 'Password updated successfully'));
};
