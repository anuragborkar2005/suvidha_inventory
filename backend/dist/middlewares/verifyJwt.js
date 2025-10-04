import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
const prisma = PrismaClient();
export const verifyJwt = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    if (!authHeaders?.startsWith("Bearer ")) {
        return res.json(new ApiResponse(401, null, "Unauthorized"));
    }
    const token = authHeaders.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.json(new ApiResponse(403, null, "Forbidden"));
        }
        if (typeof decoded === "object" &&
            decoded !== null &&
            "userId" in decoded) {
            req.userId = decoded.userId;
        }
        next();
    });
};
export const adminOnly = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    if (!authHeaders?.startsWith("Bearer ")) {
        return res.json(new ApiResponse(401, null, "Unauthorized"));
    }
    const token = authHeaders.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.json(new ApiResponse(403, null, "Forbidden"));
        }
        if (typeof decoded === "object" &&
            decoded !== null &&
            "userId" in decoded) {
            const userId = decoded.userId;
            const role = prisma.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });
            if (role === "ADMIN") {
                next();
            }
            else {
                return res.json(new ApiResponse(403, null, "Forbidden"));
            }
        }
    });
};
export const staffOnly = (req, res, next) => {
    const authHeaders = req.headers.authorization;
    if (!authHeaders?.startsWith("Bearer ")) {
        return res.json(new ApiResponse(401, null, "Unauthorized"));
    }
    const token = authHeaders.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.json(new ApiResponse(403, null, "Forbidden"));
        }
        if (typeof decoded === "object" &&
            decoded !== null &&
            "userId" in decoded) {
            const userId = decoded.userId;
            const role = prisma.user.findUnique({
                where: { id: userId },
                select: { role: true },
            });
            if (role === "STAFF") {
                next();
            }
            else {
                return res.json(new ApiResponse(403, null, "Forbidden"));
            }
        }
        next();
    });
};
//# sourceMappingURL=verifyJwt.js.map