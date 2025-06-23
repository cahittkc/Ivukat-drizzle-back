import { pgTable, uuid, text, varchar, timestamp, boolean, index } from "drizzle-orm/pg-core";

export const refresh_tokens = pgTable("refresh_tokens", {
    id: uuid("id").primaryKey().defaultRandom(),
    token: text("token").notNull().unique(),
    userId: uuid("user_id").notNull(),
    sessionId: uuid("session_id").notNull().defaultRandom(),
    deviceInfo: text("device_info"),
    ipAdress : text('ip_adress'),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    isValid: boolean("is_valid").notNull().default(false),
});