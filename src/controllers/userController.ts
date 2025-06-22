import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/responseHandler";
import { ApiError } from "../utils/ApiError";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Örnek veri, ileride db'den çekilecek
    const users = [{ id: 1, name: "Test User" }];
    if (users.length === 0) {
      throw ApiError.notFound("Kullanıcı bulunamadı");
    }
    return successResponse(res, users, "Kullanıcılar başarıyla getirildi");
  } catch (err) {
    next(err);
  }
}; 