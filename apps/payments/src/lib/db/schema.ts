import { relations } from "drizzle-orm";
import { pgEnum, pgTable, serial, text, integer } from "drizzle-orm/pg-core";

const pathType = pgEnum("path_type", ["PIX"]);

export const paths = pgTable("paths", {
  id: serial().primaryKey(),
  type: pathType(),
});

export const rails = pgTable("rails", {
  id: text().primaryKey(),
  source: integer("source")
    .notNull()
    .references(() => paths.id),
  destination: integer("destination")
    .notNull()
    .references(() => paths.id),
});

export const railsRelations = relations(rails, ({ one }) => ({
  sourcePath: one(paths, {
    fields: [rails.source],
    references: [paths.id],
    relationName: "sourcePath",
  }),
  destinationPath: one(paths, {
    fields: [rails.destination],
    references: [paths.id],
    relationName: "destinationPath",
  }),
}));

export const pathsRelations = relations(paths, ({ many }) => ({
  railsAsSource: many(rails, { relationName: "sourcePath" }),
  railsAsDestination: many(rails, { relationName: "destinationPath" }),
}));

export type Rail = typeof rails.$inferSelect;
export type Path = typeof paths.$inferSelect;

export * from "./auth-schema";
