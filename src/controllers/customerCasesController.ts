import { Request, Response , NextFunction } from "express";
import { CustomerCasesService } from "../services/customerCasesService";
import {successResponse} from "../utils/responseHandler"
import { StatusCodes } from "http-status-codes";



export class CustomerCasesController {
    private customerCasesService : CustomerCasesService

    constructor() {
        this.customerCasesService = new CustomerCasesService()
    }

    addCustomerCases = async (req : Request, res : Response, next : NextFunction) => {
        try {
            const data = req.body
            const result = await this.customerCasesService.createCustomerCases(data)
            successResponse(res,result,'Cases added', StatusCodes.OK)
        } catch (error) {
            next(error)
        }
    }

    getCustomerCases = async (req : Request, res : Response, next : NextFunction) => {
        try {
            const {customerId} = req.body
            const result = await this.customerCasesService.getCustomerCases(customerId)
            successResponse(res,result,'Cases added', StatusCodes.OK)
        } catch (error) {
            next(error)
        }
    }
}