import { pgTable, varchar, timestamp ,serial , uuid, integer, text, index} from "drizzle-orm/pg-core";
import { sql } from 'drizzle-orm';
import { users } from "./user";
import { judgment_units } from "./judgmentUnits";
import { judgment_types } from "./judgmentType";


export const case_example = pgTable('case_example', 
    {
        id : serial('id').primaryKey(),
        userId: uuid('user_id').notNull().references(() => users.id),
        esasNo : varchar('esas_no', {length : 40}).notNull(),
        oldEsasNo: text('old_esas_no').array().notNull().default(sql`ARRAY[]::text[]`),
        description : varchar('description').notNull(),
        court : varchar('court').notNull(),
        courtId : varchar('court_id'),
        date : timestamp("date", { withTimezone: true }).notNull(),
        caseNo  : varchar('case_no').unique().notNull(),
        caseStatusCode : integer('case_status_code').notNull(),
        caseTypeCode : integer('case_type_code').notNull(),
        judgmentTypeId : varchar('judgment_type_id').notNull().references(() => judgment_types.uyapId),
        judgmentUnitUyapId : varchar('judgment_unit_uyap_id').notNull().references(() => judgment_units.uyapId),
        caseClients: text('case_clients').array().default(sql`ARRAY[]::text[]`),
        normalizedEsasno : varchar('normalized_esas_no'),
        normalizedCourt : varchar('normalized_court')
    },
    (table) => ({
      normalizedEsasnoIndex: index('case_example_normalized_esas_no_idx').on(table.normalizedEsasno),
      normalizedCourtIndex: index('case_example_normalized_court_idx').on(table.normalizedCourt),
    })
);
