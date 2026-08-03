import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";

// Contract for how environments/schemas are provisioned: see DEPLOYMENT.md.

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL env var is not set.");
}

const schema = process.env.DB_SCHEMA ?? "public";
if (!/^[a-z0-9_]+$/.test(schema)) {
  throw new Error(`Invalid DB_SCHEMA: ${schema}`);
}

export const pool = new Pool({
  connectionString,
  options: `-c search_path=${schema}`,
});

export const db = drizzle(pool);

export const bootstrapDatabase = async () => {
  await pool.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);
  await migrate(db, {
    migrationsFolder: "./drizzle",
    migrationsSchema: schema,
  });
};
