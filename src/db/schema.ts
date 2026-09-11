import { pgTable, text, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import type { SahaayaAnalysisResult, PriorityLevel } from "@/types";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    salt: varchar("salt", { length: 64 }).notNull(),
    authProvider: varchar("auth_provider", { length: 32 }).default("email").notNull(),
    avatarUrl: text("avatar_url"),
    googleId: varchar("google_id", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("users_email_idx").on(table.email),
    index("users_google_id_idx").on(table.googleId),
  ]
);

export const cases = pgTable(
  "cases",
  {
    id: varchar("id", { length: 128 }).primaryKey(),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    rawInput: text("raw_input").notNull(),
    priority: varchar("priority", { length: 32 }).$type<PriorityLevel>().notNull(),
    inputSources: jsonb("input_sources").$type<Array<"text" | "voice" | "image" | "document">>().notNull(),
    result: jsonb("result").$type<SahaayaAnalysisResult>().notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("cases_user_id_idx").on(table.userId),
    index("cases_created_at_idx").on(table.createdAt),
    index("cases_user_created_idx").on(table.userId, table.createdAt),
  ]
);

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type CaseRow = typeof cases.$inferSelect;
export type NewCaseRow = typeof cases.$inferInsert;

