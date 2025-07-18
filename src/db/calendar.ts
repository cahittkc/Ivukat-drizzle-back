import { pgTable, serial, timestamp, uuid,varchar,pgEnum } from "drizzle-orm/pg-core"
import { users } from "./user"


export const calendarTypeEnum = pgEnum('type', [
    'meeting',
    'conference',
    'hearing',
    'settlement',
    'other',
  ]);


export const calendar = pgTable('calendars', 
    {
        id : serial('id').primaryKey(),
        userId : uuid('user_id').references(() => users.id),
        title : varchar('title').notNull(),
        description : varchar('description'),
        date : timestamp('date', { withTimezone : true}).notNull(),
        type : calendarTypeEnum('type').notNull().default('other') // CalendarType enumuna karşılık gelir
    }
)