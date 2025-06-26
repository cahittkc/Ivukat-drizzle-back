import { Request, Response, NextFunction } from "express";
import { successResponse } from "../utils/responseHandler";
import { ApiError } from "../utils/ApiError";
import { JudgmentTypeRepository } from "../repositories/judgmentTypeRepository";
import { db } from "../db";
import { AddJudgmentDto } from "../DTOs/JudgmentTypeDtos";

export class JudgmentTypeController {
    private judgmentTypeRepository: JudgmentTypeRepository;
    
    constructor() {
        this.judgmentTypeRepository = new JudgmentTypeRepository(db);
    }
    
    createJudgmentType = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body as AddJudgmentDto
            const result = await this.judgmentTypeRepository.create(data);
            return successResponse(res, result, "Judgment type created successfully");
        } catch (err) {
            next(err);
        }
    }

    delete = async (req : Request, res : Response, next : NextFunction) => {
        try {
            const id = parseInt(req.params.id)
            const result = await this.judgmentTypeRepository.delete(id)
            return successResponse(res,result,'Judgment Type deleted successfully')
        } catch (error) {
            next(error)
        }
    }

    getAll = async (req : Request,res: Response, next : NextFunction) => {
       try {
            const result = await this.judgmentTypeRepository.getAll();
            return successResponse(res,result , 'Judgment Type List retrivied successfully')
       } catch (error) {
            next(error)
       }
    }
}
