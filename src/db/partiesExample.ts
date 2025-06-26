import { pgTable, serial, integer , varchar} from "drizzle-orm/pg-core";

import { case_example } from "./caseExample";

export const parties_example = pgTable('parties_example', {
    id: serial('id').primaryKey(),
    caseId: integer('case_id').notNull().references(() => case_example.id),
    esasNo : varchar('esas_no', {length : 40}).notNull().references(() => case_example.esasNo),
    rol : varchar('rol', {length: 70}).notNull(),
    type : varchar('type').notNull(),
    fullName : varchar('full_name').notNull(),
    deputy : varchar('deputy')
});