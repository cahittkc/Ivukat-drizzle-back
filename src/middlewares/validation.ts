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
      const path = err.errors?.[0]?.path?.join('.') || '';
      next(ApiError.badRequest(
        path
          ? `${path} field is ${err.errors?.[0]?.message}`
          : err.errors?.[0]?.message || "Geçersiz veri"
      ));
    }
  };