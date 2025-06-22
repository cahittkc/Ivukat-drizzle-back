import { UserRepository } from "../repositories/userRepository";
import { db } from "../db";
import { RegisterDto } from "../DTOs/authDto";
import { ApiError } from "../utils/ApiError";
import bcrypt from "bcryptjs";

export class AuthService {
    private userRepository : UserRepository

    constructor(){
        this.userRepository = new UserRepository(db);
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

}