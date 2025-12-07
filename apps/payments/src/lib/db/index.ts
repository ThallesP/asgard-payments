import "dotenv/config";
import { drizzle } from "drizzle-orm/bun-sql";
import { createClient } from "tigerbeetle-node";
import { env } from "../../env";

export const db = drizzle(process.env.DATABASE_URL);
export const ledger = createClient({
  cluster_id: 0n,
  replica_addresses: [env.LEDGER_DATABASE_URL],
});
