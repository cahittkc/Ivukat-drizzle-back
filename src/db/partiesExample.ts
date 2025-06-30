import { pgTable, serial, integer , varchar} from "drizzle-orm/pg-core";

import { case_example } from "./caseExample";

export const parties_example = pgTable('parties_example', {
    id: serial('id').primaryKey(),
    caseNo: varchar('case_no').notNull().references(() => case_example.caseNo),
    rol : varchar('rol', {length: 70}).notNull(),
    type : varchar('type').notNull(),
    fullName : varchar('full_name').notNull(),
    deputy : varchar('deputy')
});