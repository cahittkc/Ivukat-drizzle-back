import { pgTable, uuid, text, varchar, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    username: varchar("name", { length: 40 }).unique().notNull(),
    email: varchar("email", { length: 40 }).unique().notNull(),
    password: varchar('password', { length: 255 }).notNull(),
    isVerified: boolean("is_verified").notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => ({
    usernameIndex: index("users_username_idx").on(table.username),
    emailIndex: index("users_email_idx").on(table.email),
  })
);