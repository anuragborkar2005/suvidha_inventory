import { ApiResponse } from "../utils/ApiResponse.js";
import type { Request, Response } from "express";

export const healthCheck = (req: Request, res: Response) => {
  return res.json(new ApiResponse(200, null, "HealthCheck Successfull"));
};
