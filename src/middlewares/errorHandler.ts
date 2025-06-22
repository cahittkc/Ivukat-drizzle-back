import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { errorResponse } from "../utils/responseHandler";

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  if (err instanceof ApiError) {
    return errorResponse(res, err.message, err.statusCode);
  }
  return errorResponse(res, err.message || "Internal Server Error", 500);
} 