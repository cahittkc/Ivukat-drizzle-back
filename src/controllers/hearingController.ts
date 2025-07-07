import { db } from "../db";
import { HearingRepository } from "../repositories/hearingRepository";
import { Request,Response , NextFunction } from "express";
import { successResponse } from "../utils/responseHandler";
import { StatusCodes } from "http-status-codes";



export class HearingController{
    private hearingRepository : HearingRepository

    constructor(){
        this.hearingRepository = new HearingRepository(db)
    }


    getHearingAndParties = async (req: Request, res : Response , next : NextFunction) => {
        try {
            const userId = req.body.userId as string
            const result = await this.hearingRepository.getHearingAndParties(userId)
            successResponse(res,result,'Duruşma ve tarafları başarıyla listelendi', StatusCodes.OK)
        } catch (error) {
            next(error)
        }
    }
}