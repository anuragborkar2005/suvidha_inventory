// types/express.d.ts
declare global {
  namespace Express {
    interface Request {
      userId?: number;
      userRole?: "ADMIN" | "STAFF";
    }
  }
}

export {}; // 👈 ensures this file is treated as a module