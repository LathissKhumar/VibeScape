// Minimal, safe Postgres/Drizzle client bootstrap.
// We avoid static imports so the build doesn't fail if deps are not installed.

type DbClient = unknown | null;

function createDbClient(): DbClient {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  // Dynamically require packages at runtime only when DATABASE_URL is present.
  // This prevents the static TypeScript/Next build from failing when deps
  // (drizzle-orm, pg) are not installed.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { drizzle } = require("drizzle-orm/node-postgres");
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Pool } = require("pg");

  const pool = new Pool({ connectionString: url });
  return drizzle(pool);
}

export const db: DbClient = createDbClient();
