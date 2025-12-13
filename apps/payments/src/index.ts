import { Elysia } from "elysia";
import { db, ledger } from "./lib/db";
import { fromTypes, openapi } from "@elysiajs/openapi";

import { Rail } from "./entities/Rail";

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
  .get("/rails", async (): Promise<Simplify<Rail>> => {
    return new Rail({ id: "123" });
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
