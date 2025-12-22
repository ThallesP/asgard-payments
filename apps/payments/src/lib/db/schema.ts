import { pgTable, jsonb, serial, text } from "drizzle-orm/pg-core";

export const rails = pgTable("rails", {
  id: text().primaryKey(),
  source: jsonb().notNull(),
});

export type Rail = typeof rails.$inferSelect;

export * from "./auth-schema";
