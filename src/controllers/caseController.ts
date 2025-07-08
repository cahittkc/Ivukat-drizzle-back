import { Request, Response , NextFunction } from "express";
import { CaseRepository } from "../repositories/caseRepository";
import { db } from "../db";
import { successResponse } from "../utils/responseHandler";
import { StatusCodes } from "http-status-codes";
import { CaseService } from "../services/caseService";
import { ApiError } from "../utils/ApiError";





export class CaseController{
    private caseService : CaseService
   
    constructor(){
        this.caseService = new CaseService();
    }

    getCaseByUserId = async (req : Request , res : Response , next : NextFunction) => {
        try {
            const data = req.body
            const result = await this.caseService.getCaseByUserIdWithPaginationService(data)
            successResponse(res,result, 'Davalar başarıyla listelendi', StatusCodes.OK)
        } catch (error) {
            next(error)
        }
    }

    getCaseInfo = async (req : Request , res : Response , next : NextFunction) => {
        try {
            const caseNo = req.body.caseNo
            const result = await this.caseService.getCaseInfo(caseNo)
            successResponse(res,result, 'Dava bilgileri başarıyla listelendi', StatusCodes.OK)
        } catch (error) {
            next(error)
        }
    }


    searchCase = async (req : Request , res : Response , next : NextFunction) => {
        try {
            const data = req.body
            if(!data){
                throw ApiError.badRequest('data bulunamadı lütfen uygun şekilde data gönderiniz')
            }
            const result = await this.caseService.searchCaseByEsasNoOrCourtLikeService(data)
            successResponse(res,result, 'Aranılan dava bilgileri listelendi', StatusCodes.OK)
        } catch (error) {
            next(error)
        }

    }


}