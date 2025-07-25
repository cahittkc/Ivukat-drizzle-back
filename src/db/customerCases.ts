import { pgTable, uuid, varchar,primaryKey } from "drizzle-orm/pg-core";
import { customer } from "./customers";
import { case_example } from "./caseExample";



export const customerCases = pgTable('customer_cases', {
        customerId : uuid('customer_id').references(() => customer.id),
        caseNo : varchar('case_no').references(() => case_example.caseNo)
    }, (t) => ({
        pk: primaryKey(t.customerId, t.caseNo),
    })

)