import { Request ,Response , NextFunction } from "express";
import { AuthService } from "../services/authService";
import { RegisterDto } from "../DTOs/authDto";
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
}