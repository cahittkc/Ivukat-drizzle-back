import { Request, Response, NextFunction } from "express"
import {addCaseWithParties} from "../Transactions/caseAndPartiesTransaction"
import { successResponse } from "../utils/responseHandler"
import { StatusCodes } from 'http-status-codes';
import { CaseRepository } from "../repositories/caseRepository";
import { db } from "../db";



export class CustomController{

        caseRepository : CaseRepository

        constructor(){
            this.caseRepository = new CaseRepository(db);
        }




        addCaseAndParties = async (req : Request, res : Response, next : NextFunction) => {
            try {
                const data = req.body
                const result = await addCaseWithParties(data)
                successResponse(res,result,'Case and Parties added succesfully', StatusCodes.OK)
            } catch (error) {
                next(error)
            }
        }


        getCaseAndParties = async (req : Request, res : Response, next : NextFunction) => {
            try {
                const esasNo = req.body.esasNo
                const result = await this.caseRepository.getCaseWithPartiesById(esasNo)
                successResponse(res,result, 'case and parties retrivied', StatusCodes.OK)
            } catch (error) {
                next(error)
            }
        }
}