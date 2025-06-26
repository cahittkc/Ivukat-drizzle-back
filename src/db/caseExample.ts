import { pgTable, varchar, timestamp ,serial , uuid} from "drizzle-orm/pg-core";
import { users } from "./user";


export const case_example = pgTable('case_example', 
    {
        id : serial('id').primaryKey(),
        userId: uuid('user_id').notNull().references(() => users.id),
        esasNo : varchar('esas_no', {length : 40}).unique().notNull(),
        description : varchar('description').notNull(),
        court : varchar('court').notNull(),
        date : timestamp("date", { withTimezone: true }).notNull(),
    }   
);
