import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { errorResponse } from "../utils/responseHandler";
import { AuthService } from "../services/authService";


declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}


export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return next(ApiError.unauthorized('Invalid token'));
    }
    let decodedToken;
    try {
        decodedToken = AuthService.verifyToken(token);
    } catch (err) {
        return next(ApiError.unauthorized('Invalid token'));
    }
    req.user = decodedToken;
    next();
}