import { pgTable, uuid, varchar, pgEnum,text } from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
import { users } from "./user";

export const customerTypeEnum = pgEnum('type', [
    'person',
    'corporation'
]);


export const customer = pgTable('customers', {
    id : uuid('id').primaryKey().defaultRandom(),
    userId : uuid('user_id').references(() => users.id),
    firstName : varchar('first_name', {length : 40}),
    middleName : varchar('middle_name', {length : 40}),
    lastName : varchar('last_name', {length : 40}),
    companyName : varchar('company_name'),
    type : customerTypeEnum('type').notNull().default('person'),
    identityNumber : varchar('identity_number' , {length : 11}),
    taxNumber : varchar('tax_number', {length : 10}),
    caseNumbers: text('case_clients').array().default(sql`ARRAY[]::text[]`),

})