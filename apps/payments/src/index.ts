import { Elysia } from "elysia";
import { ledger } from "./lib/db";
import { type GatewayProps, Gateway } from "./entities/Gateway";
import { fromTypes, openapi } from "@elysiajs/openapi";
import path from "node:path";

export const app = new Elysia()
  .use(
    openapi({
      references: fromTypes(),
    }),
  )
  .get("/gateways", async () => {
    return [new Gateway({ id: "1" })]; // can't even detect classes, damn
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
