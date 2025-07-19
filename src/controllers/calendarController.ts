import { NewCalendarDto, newCalendarSchema } from "../DTOs/calendarDto";
import { CalendarService } from "../services/calendarService";
import { Request, Response,NextFunction } from "express";
import { successResponse } from "../utils/responseHandler";
import { StatusCodes } from "http-status-codes";





export class CalendarController{
    private calendarService  : CalendarService

    constructor(){
        this.calendarService = new CalendarService()
    }


    create = async (req : Request, res : Response , next : NextFunction) => {
        try {
            const parsedData = newCalendarSchema.parse(req.body);
            const result = await this.calendarService.create(parsedData)
            successResponse(res, result, 'Calendar Saved', StatusCodes.OK)
        } catch (error) {
            next(error)
        }

    }

}