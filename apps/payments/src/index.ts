import { Elysia } from "elysia";
import { db, ledger } from "./lib/db";
import { fromTypes, openapi } from "@elysiajs/openapi";
import { Rail, rails } from "./lib/db/schema";

import z from "zod";
import { upid } from "upid-ts";
import { PathFactory } from "./lib/paths/PathFactory";

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
    async ({ body: { source } }): Promise<unknown> => {
      const pathFactory = PathFactory.getInstance();

      const sourcePath = pathFactory.get(source.type).createSource();

      // const rail = await db
      //   .insert(rails)
      //   .values({
      //     id: upid("rail").toStr(),
      //     source,
      //     destination,
      //   })
      //   .returning();

      return sourcePath;
    },
    {
      body: z.object({
        source: z.discriminatedUnion("type", [
          z.object({
            type: z.literal("PIX"),
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
