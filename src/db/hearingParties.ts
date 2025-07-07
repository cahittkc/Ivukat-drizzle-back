import { pgTable,serial,bigint, varchar, uuid } from "drizzle-orm/pg-core";
import { hearing } from "./hearing";
import { users } from "./user";



export const hearing_parties = pgTable('hearing_parties', {
    id : serial('id').primaryKey(),
    userId : uuid('user_id').notNull().references(() => users.id),
    hearingId : bigint('hearing_id', { mode: 'number' }).references(() => hearing.hearingId),
    name : varchar('name').notNull(),
    lastName : varchar('last_name'),
    attribution : varchar('attribution').notNull(),
})