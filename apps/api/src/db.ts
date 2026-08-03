import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL env var is not set.");
}

export const pool = new Pool({ connectionString });

export type WithKey<T> = T & { $key: string };

export const rowToRecord = <T>(row: { id: string; data: T }): WithKey<T> => ({
  $key: row.id,
  ...row.data,
});
