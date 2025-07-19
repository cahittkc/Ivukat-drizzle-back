import { db } from "../db";
import { NewCalendarDto } from "../DTOs/calendarDto";
import { CalendarRepository } from "../repositories/calendarRepository";
import { UserRepository } from "../repositories/userRepository";
import { ApiError } from "../utils/ApiError";





export class CalendarService {
    private calendarRepository : CalendarRepository
    private userRepository : UserRepository

    constructor(){
        this.calendarRepository = new CalendarRepository(db)
        this.userRepository = new UserRepository(db)
    }

    async create(data : NewCalendarDto){
        const user = await this.userRepository.findById(data.userId)
        if(!user){
            throw ApiError.badRequest('User not found')
        }

        const newCalendar = await this.calendarRepository.create(data)

        return newCalendar
    }
}