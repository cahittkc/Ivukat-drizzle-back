// drizzle/schemas/uploadedFiles.ts

import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { customer } from "./customers"; // referans verilecek customer tablosu
import {users} from "./user"

export const uploadedFiles = pgTable("uploaded_files", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id , { onDelete: "cascade" }),
  customerId: uuid("customer_id").notNull().references(() => customer.id , { onDelete: "cascade" }),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone : true }).defaultNow(),
});
