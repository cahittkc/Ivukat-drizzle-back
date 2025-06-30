import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { case_example } from "./caseExample";
import { users } from "./user";

export const clients = pgTable('clients', {
    id: uuid('id').primaryKey().defaultRandom(),
    fullName: varchar('full_name').notNull(),
    caseNo: varchar('case_no').notNull().references(() => case_example.caseNo),
    userId: uuid('user_id').notNull().references(() => users.id),
});