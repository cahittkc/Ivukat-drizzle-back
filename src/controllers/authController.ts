import { Request ,Response , NextFunction } from "express";
import { AuthService } from "../services/authService";
import { LoginDto, RegisterDto } from "../DTOs/authDto";
import { successResponse } from "../utils/responseHandler";
import { StatusCodes } from 'http-status-codes';
import { ApiError } from "../utils/ApiError";


export class AuthController{
    private authService : AuthService

    constructor() {
        this.authService = new AuthService();
    }

    private sanitizeUser(user: any) {
        const sanitizedUser = { ...user };
        delete sanitizedUser.password; // Remove password from the response
        return sanitizedUser;
    }


    login = async (req: Request, res: Response, next : NextFunction) => {
        try {
            const userData = req.body as LoginDto
            const result = await this.authService.login(userData,req)
            const sanitizedUser = this.sanitizeUser(result);
            successResponse(res,sanitizedUser, 'User login successfully', StatusCodes.OK)
        } catch (error) {
            next(error);
        }
    }


    session = async (req: Request, res: Response, next : NextFunction) => {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            return next(new ApiError(StatusCodes.UNAUTHORIZED, 'No authorization header provided'));
        }
        const token = authHeader.split(' ')[1]; // Bearer <token>
        if (!token) {
            return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token format'));
        }

        const decodedToekn = AuthService.verifyToken(token)

        if(!decodedToekn){
            return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid token format'));
        }

        const user = await this.authService.session(decodedToekn.id)

        successResponse(res, user, 'session verified succesfull', StatusCodes.OK);

    }

    register = async (req: Request, res: Response, next : NextFunction) => {
        try {
            const userData = req.body as RegisterDto
            const user = await this.authService.register(userData)
            const sanitizedUser = this.sanitizeUser(user);
            successResponse(res,sanitizedUser, 'User register successfully', StatusCodes.OK)
        } catch (error) {
            if (error.code === '23505') { 
                // PostgreSQL unique violation error code
                // Get the constraint name from the error message
                const constraintMatch = error.detail?.match(/\"(.+?)\"/);
                const constraint = constraintMatch ? constraintMatch[1] : '';
                
                // Get the value that caused the duplicate from the error message
                const valueMatch = error.detail?.match(/=\((.+?)\)/);
                const value = valueMatch ? valueMatch[1] : '';
                
                // Map constraint names to user-friendly field names and messages
                let fieldName = 'field';
                let message = 'Registration failed due to duplicate entry';
                
                if (constraint.includes('users_email_key')) {
                    fieldName = 'email';
                    message = `The email address "${value}" is already registered. Please use a different email or try logging in.`;
                } else if (constraint.includes('users_username_key')) {
                    fieldName = 'username';
                    message = `The username "${value}" is already taken. Please choose a different username.`;
                }
                
                next(new ApiError(StatusCodes.CONFLICT, message, { 
                    error: error.message,
                    field: fieldName,
                    value: value
                }));
            } else if (error instanceof ApiError) {
                // If it's already an ApiError, pass it through
                next(error);
            } else {
                // For other errors, create a generic error message
                next(new ApiError(
                    StatusCodes.BAD_REQUEST,
                    'Registration failed. Please check your input and try again.',
                    { error: error.message }
                ));
            }
        }
    }

    refreshToken = async (req: Request, res: Response, next : NextFunction) => {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            console.log("------------------------------------------------------------");
            console.log("token",token);
            if(!token){
                throw ApiError.unauthorized('Invalid token');
            }
            const result = await this.authService.refreshToken(token, req);
            successResponse(res, result, 'Refresh token successfully', StatusCodes.OK);
        } catch (error) {
            next(error);
        }
    }

    logout = async (req: Request, res: Response, next : NextFunction) => {
        try {
            const token = req.headers['authorization']?.split(' ')[1];
            if(!token){
                throw ApiError.unauthorized('Invalid token');
            }
            await this.authService.logout(token);
            successResponse(res, null, 'Logout successfully', StatusCodes.OK);
        } catch (error) {
            next(error);
        }
    }
}