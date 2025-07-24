import { Request,Response,NextFunction } from "express";
import { CustomerService } from "../services/customerService";
import { NewCustomerDto, newCustomerSchema } from "../DTOs/customerDtos";
import {successResponse} from "../utils/responseHandler"
import { StatusCodes } from "http-status-codes";


export class CustomerController{
    private customerService : CustomerService

    constructor() {
        this.customerService = new CustomerService()
    }


    createCustomer = async (req: Request,res : Response, next : NextFunction ) => {
        try {
            const data = req.body as NewCustomerDto
            const result = await this.customerService.createCustomer(data)
            successResponse(res,result, 'Customer added succesfully', StatusCodes.OK)
        } catch (error) {
            next(error)
        }
    }

    getCustomersByUserId = async (req: Request,res : Response, next : NextFunction) => {
        try {
            const data = req.body
            const result = await this.customerService.getCustomersByUserId(data)
            successResponse(res,result, 'Customer added succesfully', StatusCodes.OK)
        } catch (error) {
            next(error)
        }
    }
}