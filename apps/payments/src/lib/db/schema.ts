import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const accounts = pgTable("accounts", {
  id: text().primaryKey(),
});

export * from "./auth-schema";
