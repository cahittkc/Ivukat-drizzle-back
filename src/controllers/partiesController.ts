import { Request, Response, NextFunction } from "express";
import { PartiesRepository } from "../repositories/partiesRepository";
import { db } from "../db";
import { successResponse } from "../utils/responseHandler";
import { StatusCodes } from "http-status-codes";




export class PartiesController{
    private repository : PartiesRepository

    constructor(){
        this.repository = new PartiesRepository(db)
    }


    getPartiesByCaseNo = async (req : Request, res : Response , next : NextFunction) => {
        try {
            const data = req.params.caseNo as string
            const result = await this.repository.getPartiesByCaseNo(data)
            successResponse(res, result , 'Dava Tarafları başarıyla listelendi', StatusCodes.OK)
        } catch (error) {
            next(error)
        }
    }
}