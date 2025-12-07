import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey } from "better-auth/plugins";
import { db } from "./db";

export const auth = betterAuth({
  plugins: [apiKey()],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
