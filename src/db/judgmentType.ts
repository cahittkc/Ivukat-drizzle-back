import { pgTable, uuid, text, varchar, timestamp, boolean, index,serial } from "drizzle-orm/pg-core";

export const judgment_types = pgTable("judgment_types", 
    {
        id: serial('id').primaryKey(),
        name: varchar("name", { length: 40 }).unique().notNull(),
        uyapId : varchar("uyap_id", { length: 40 }).notNull().unique(),
        createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true }),
        deletedAt: timestamp('deleted_at', { withTimezone: true }),
    },
    (table) => ({
        uyapIdIndex: index("judgment_types_uyap_id_idx").on(table.uyapId),
    })
);


