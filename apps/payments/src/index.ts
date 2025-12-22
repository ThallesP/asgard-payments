import { Elysia } from "elysia";
import { db, ledger } from "./lib/db";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { Rail, rails } from "./lib/db/schema";

import z from "zod";
import { upid } from "upid-ts";

export type Simplify<T> = {
  [K in keyof T]: T[K];
} & {};

export const app = new Elysia()
  .use(
    openapi({
      references: fromTypes("src/index.ts", {
        silent: true,
      }),
    }),
  )
  .post(
    "/rails",
    async ({ body: { source } }): Promise<Simplify<Rail>> => {
      const rail = await db
        .insert(rails)
        .values({
          id: upid("rail").toStr(),
          source,
        })
        .returning();

      return rail[0];
    },
    {
      body: z.object({
        source: z.discriminatedUnion("type", [
          z.object({
            type: z.literal("PIX"),
            key: z.string(),
            kind: z.enum(["CPF", "CNPJ", "RANDOM", "EMAIL", "PHONE_NUMBER"]),
          }),
        ]),
        destination: z.discriminatedUnion("type", [
          z.object({
            type: z.literal("POLYGON"),
            address: z.string(),
          }),
        ]),
      }),
    },
  )
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
