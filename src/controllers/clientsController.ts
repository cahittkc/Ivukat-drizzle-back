import { Request, Response, NextFunction } from "express";
import { ClientRepository } from "../repositories/clientsRepository";
import { db } from "../db";
import { successResponse } from "../utils/responseHandler";
import { StatusCodes } from "http-status-codes";
import { ClientService } from "../services/clientService";


export class ClientController {
    private service : ClientService

    constructor(){
        this.service = new ClientService()
    }


    getClientByUserId = async (req : Request, res : Response , next: NextFunction) => {
        try {
            const data =  req.body
            const result = await this.service.getClientsPaginatedByUserId(data)
            successResponse(res,result , 'Müvekkil listesi başarıyla listelendi', StatusCodes.OK)
        } catch (error) {
            next(error)
        }

    }
}