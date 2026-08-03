import { jsonb, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";

export const jsonbTable = (name: string) =>
  pgTable(name, {
    id: uuid("id").primaryKey().defaultRandom(),
    data: jsonb("data").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  });

export type JsonbTable = ReturnType<typeof jsonbTable>;
