import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import { ApiError } from "../utils/ApiError";

export const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (err: any) {
      next(ApiError.badRequest(err.errors?.[0]?.message || "Geçersiz veri"));
    }
  };