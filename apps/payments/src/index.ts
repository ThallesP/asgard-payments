import { Elysia } from "elysia";
import { ledger } from "./lib/db";

const app = new Elysia().get("/accounts", async () => {}).listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
