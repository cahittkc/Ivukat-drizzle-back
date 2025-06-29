import { Request, Response,NextFunction } from "express";
import { JudgmentUnitRepository } from "../repositories/judgmentUnitRepository";
import {db} from "../db/index"
import { AddJudgmentUNitDTO } from "../DTOs/JudgmentTypeDtos";
import { successResponse } from "../utils/responseHandler";
import { StatusCodes } from "http-status-codes";




export class JudgmentUnitController {
    private repository : JudgmentUnitRepository


    constructor(){
        this.repository = new  JudgmentUnitRepository(db)
    }


    create = async (req : Request,res: Response , next : NextFunction) => {
        try {
            const data = req.body as AddJudgmentUNitDTO
            const result = await this.repository.create(data)
            successResponse(res,result, 'Judgment unit create successfully', StatusCodes.OK)
        } catch (error) {
            next(error)
        }
    }

    getJudgmentUnitByJudgmentTypeUyapId = async (req : Request,res: Response , next : NextFunction) => {
        try {
            const id = req.params.id
            const result = await this.repository.getJudgmentUnitByJudgmentTypeUyapId(id)
            successResponse(res,result, 'Judgment units successfully listed', StatusCodes.OK)
        } catch (error) {
            next(error)
        }
    }
}