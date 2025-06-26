import { Request, Response, NextFunction } from "express"
import {addCaseWithParties} from "../Transactions/caseAndPartiesTransaction"
import { successResponse } from "../utils/responseHandler"
import { StatusCodes } from 'http-status-codes';



export class CustomController{
        addCaseAndParties = async (req : Request, res : Response, next : NextFunction) => {
            try {
                const data = req.body
                const result = await addCaseWithParties(data)
                successResponse(res,result,'Case and Parties added succesfully', StatusCodes.OK)
            } catch (error) {
                next(error)
            }
        }
}