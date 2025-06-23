import { UserRepository } from "../repositories/userRepository";
import { db } from "../db";
import { LoginDto, RegisterDto } from "../DTOs/authDto";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcryptjs";
import { JWT_SECRET, jwtOptions, refreshTokenOptions, JWT_EXPIRES_IN, REFRESH_TOKEN_EXPIRES_IN, REFRESH_TOKEN_SECRET } from "../utils/auth";
import jwt from "jsonwebtoken";
import { InferSelectModel } from "drizzle-orm";
import { users } from "../db/user";
import { refresh_tokens } from "../db/refresh_token";
import { randomUUID } from 'crypto';
import { RefreshTokenRepository } from "../repositories/refreshTokenRepository";
import { Request} from "express";

// Define the User type using drizzle-orm's InferSelectModel
export type User = InferSelectModel<typeof users>;


export class AuthService {
    private userRepository : UserRepository
    private refreshTokenRepository : RefreshTokenRepository

    constructor(){
        this.userRepository = new UserRepository(db);
        this.refreshTokenRepository = new RefreshTokenRepository(db);

    }


    async register(data :RegisterDto){
        const existUsername = await this.userRepository.findByUsername(data.username)
        if(existUsername){
            throw ApiError.badRequest('Username already exist');
        }

        const existEmail = await this.userRepository.findByEmail(data.email)
        if(existEmail){
            throw ApiError.badRequest('Email already exist')
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(data.password, salt);

        const user = await this.userRepository.create({
            ...data,
            password : hashedPassword
        })

        return user;
    }

    async login(data :LoginDto, req : Request){
        const user = await this.userRepository.findByUsername(data.username)
        if(!user){
            throw ApiError.badRequest('Username not found')
        }

        const isMatch = await bcrypt.compare(data.password, user.password)
        if(!isMatch){
            throw ApiError.badRequest('Password not match')
        }

        const sessionId = randomUUID();

        const accessToken = this.generateAccessToken(user,sessionId);
        const refreshToken = this.generateRefreshToken(user);
        const expiresInSeconds = this.parseExpiresIn(JWT_EXPIRES_IN);
        const expiresIn = Date.now() + (expiresInSeconds * 1000); // Saniyeyi milisaniyeye çevirip şimdiki zamana ekliyoruz
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);


        await this.refreshTokenRepository.create({
            token : refreshToken,
            userId : user.id,
            expiresAt : expiresAt,
            ipAdress : req.ip,
            deviceInfo : req.headers['user-agent'] ? req.headers['user-agent'] : null
        })

        const fullUser = {
            ...user,
            accessToken,
            expiresIn
        }


        return fullUser;
    }

    private generateAccessToken(user: User, sessionId : string): string {
        // Kullanıcının ve rolünün varlığını kontrol et
        if (!user) {
            // Hata durumunu loglayabilir veya farklı bir işlem yapabilirsiniz
            console.error("Error: User or user role is undefined for access token generation.", user);
            throw new Error("Cannot generate access token: User or role information is missing.");
        }

        const payload = {
            id: user.id,
            email: user.email,
            username: user.username,
            sessionId
        };

        return jwt.sign(payload, JWT_SECRET, jwtOptions);
    }

    private generateRefreshToken(user: User): string {
        const payload = {
            id: user.id,
            username: user.username,
            email: user.email,
        };

        return jwt.sign(payload, REFRESH_TOKEN_SECRET, refreshTokenOptions);
    }

    static verifyToken(token: string): any {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (error) {
            throw ApiError.unauthorized('Invalid token');
        }
    }

    private parseExpiresIn(expiresIn: string): number {
        const match = expiresIn.match(/^(\d+)([mhd])$/);
        if (!match) {
            throw new Error('Invalid expiresIn format');
        }

        const [, value, unit] = match;
        const numValue = parseInt(value, 10);

        switch (unit) {
            case 'm': // minutes
                return numValue * 60;
            case 'h': // hours
                return numValue * 60 * 60;
            case 'd': // days
                return numValue * 24 * 60 * 60;
            default:
                throw new Error('Invalid time unit');
        }
    }

}