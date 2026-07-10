// One-time schema setup: npm run db:init
// Reads db/schema.sql and executes it against POSTGRES_URL from .env.local.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { sql } from "@vercel/postgres";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schema = readFileSync(join(__dirname, "schema.sql"), "utf-8");

const statements = schema
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
  console.log("Ran:", statement.split("\n")[0].slice(0, 60), "...");
}

console.log(`Done. Executed ${statements.length} statements.`);
process.exit(0);
