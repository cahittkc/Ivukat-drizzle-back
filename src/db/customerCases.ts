import { pgTable, uuid, varchar,primaryKey } from "drizzle-orm/pg-core";
import { customer } from "./customers";
import { case_example } from "./caseExample";



export const customerCases = pgTable('customer_cases', {
        customerId : uuid('customer_id').notNull().references(() => customer.id),
        caseNo : varchar('case_no').notNull().references(() => case_example.caseNo)
    }, (t) => ({
        pk: primaryKey({ columns: [t.customerId, t.caseNo] }),
    })

)