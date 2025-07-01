import { Request, Response , NextFunction } from "express";
import { CaseRepository } from "../repositories/caseRepository";
import { db } from "../db";
import { successResponse } from "../utils/responseHandler";
import { StatusCodes } from "http-status-codes";





export class CaseController{

    private repository : CaseRepository

    constructor(){
        this.repository = new CaseRepository(db);
    }

    getCaseByUserId = async (req : Request , res : Response , next : NextFunction) => {
        try {
            const userId = req.body.userId
            const result = await this.repository.getCaseByUserId(userId)
            successResponse(res,result, 'Davalar başarıyla listelendi', StatusCodes.OK)
        } catch (error) {
            next(error)
        }
    }

    getCaseInfo = async (req : Request , res : Response , next : NextFunction) => {
        try {
            const caseNo = req.body.caseNo
            const result = await this.repository.getCaseInfo(caseNo)
            successResponse(res,result, 'Dava bilgileri başarıyla listelendi', StatusCodes.OK)
        } catch (error) {
            next(error)
        }
    }


}