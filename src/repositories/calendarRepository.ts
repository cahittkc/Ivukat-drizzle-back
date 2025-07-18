import { eq, InferInsertModel, InferSelectModel } from "drizzle-orm";
import { calendar } from "../db/calendar";
import { NewCalendarDto } from "../DTOs/calendarDto";

type Calendar = InferSelectModel<typeof calendar>;



export class CalendarRepository {
    private db;

    constructor(dbInstance: any){
        this.db = dbInstance
    }



    async create(data : NewCalendarDto): Promise<Calendar>{
        const result = await this.db.insert(calendar).values(data).returning();
        return result[0];
    }


    async getAllByUserId(userId : string): Promise<Calendar[]>{
        const result = await this.db.select(
            {   
                id: calendar.id,
                title : calendar.title,
                description : calendar.description,
                date : calendar.date,
                type : calendar.type
            }
        ).from(calendar).where(eq(calendar.userId, userId))
        return result;

    }
}