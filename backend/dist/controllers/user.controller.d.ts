import type { Request, Response } from "express";
export declare const register: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const logout: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updatePassword: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const addStaff: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const getAllStaff: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=user.controller.d.ts.map