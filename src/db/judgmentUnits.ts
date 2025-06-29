import { pgTable, serial,varchar } from "drizzle-orm/pg-core";
import { judgment_types } from "./judgmentType";

export const judgment_units = pgTable('judgment_units', 
    {
        id: serial("id").primaryKey(),
        judgmentTypeUyapId: varchar("judgment_type_uyap_id").notNull().references(() => judgment_types.uyapId),
        uyapId : varchar('uyap_id').notNull().unique(),
        name : varchar('name').notNull().default('')
    },
);