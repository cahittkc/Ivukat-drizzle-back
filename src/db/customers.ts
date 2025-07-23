import { pgTable, uuid, varchar, pgEnum,text,timestamp,index } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
import { users } from "./user";

export const customerTypeEnum = pgEnum('customerTypeEnum', [
    'person',
    'company'
]);


export const customer = pgTable('customers', 
    {
        id : uuid('id').primaryKey().defaultRandom(),
        userId : uuid('user_id').references(() => users.id),
        firstName : varchar('first_name', {length : 40}),
        middleName : varchar('middle_name', {length : 40}),
        lastName : varchar('last_name', {length : 40}),
        companyName : varchar('company_name'),
        customerType : customerTypeEnum('customer_type').notNull().default('person'),
        identityNumber : varchar('identity_number' , {length : 11}),
        taxNumber : varchar('tax_number', {length : 10}),
        caseNumbers: text('case_clients').array().default(sql`ARRAY[]::text[]`),
        normalizeName : varchar('nomalize_name'),
        normalizeCompanyName : varchar('normalize_company_name'),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }),
        deletedAt: timestamp('deleted_at', { withTimezone: true }),
    },
    (table) => ({
        normalizeNameIndex: index('customer_normalize_name_idx').on(table.normalizeName),
        normalizeCompanyNameIndex: index('customer_normalize_company_name_idx').on(table.normalizeCompanyName),
    })


)