import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";
import { ApiResponse } from "../utils/ApiResponse.js";
import { PrismaClient } from "../generated/prisma/index.js";
import { sign } from "crypto";
const prisma = new PrismaClient();
export const register = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json(new ApiError(201, "All fields are required"));
    }
    const existingUser = await prisma.user.findUnique({
        where: { email: username },
    });
    if (existingUser) {
        throw new ApiError(409, "Username already taken");
    }
    const user = await prisma.user.create({
        data: {
            name: username,
            email: username,
            role: "STAFF",
            password,
        },
    });
    return res.json(new ApiResponse(200, user, "User registered successfully"));
};
export const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.json(new ApiError(201, "All fields are required"));
    }
    const user = await prisma.user.findUnique({
        where: { email: username },
    });
    const accessToken = jwt.sign({ userId: user?.id }, process.env.JWT_SECRET_KEY, { expiresIn: "12h" });
    const refreshToken = jwt.sign({ userId: user?.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "7d",
    });
    const updatedUser = await prisma.user.update({
        where: { id: user?.id, email: user?.email },
        data: {
            refreshToken,
        },
    });
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie("refreshToken", refreshToken, cookieOptions);
    return res.json({ accessToken });
};
export const logout = async (req, res) => {
    res.clearCookie("refreshToken");
};
export const updatePassword = async (req, res) => { };
//# sourceMappingURL=user.controller.js.map