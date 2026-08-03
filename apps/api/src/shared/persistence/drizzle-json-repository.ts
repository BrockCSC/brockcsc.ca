import { eq, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { Repository } from "../domain/repository.js";
import type { JsonbTable } from "./jsonb-table.js";

export class DrizzleJsonRepository<
  T extends { id: string },
> implements Repository<T> {
  constructor(
    private readonly db: NodePgDatabase,
    private readonly table: JsonbTable,
  ) {}

  async findAll(): Promise<T[]> {
    const rows = await this.db
      .select()
      .from(this.table)
      .orderBy(this.table.createdAt);
    return rows.map((row) => this.toEntity(row));
  }

  async findById(id: string): Promise<T | null> {
    const rows = await this.db
      .select()
      .from(this.table)
      .where(eq(this.table.id, id));
    return rows[0] ? this.toEntity(rows[0]) : null;
  }

  async create(input: Omit<T, "id">): Promise<T> {
    const rows = await this.db
      .insert(this.table)
      .values({ data: input })
      .returning();
    return this.toEntity(rows[0]);
  }

  async update(id: string, patch: Partial<Omit<T, "id">>): Promise<T | null> {
    const rows = await this.db
      .update(this.table)
      .set({ data: sql`${this.table.data} || ${patch}::jsonb` })
      .where(eq(this.table.id, id))
      .returning();
    return rows[0] ? this.toEntity(rows[0]) : null;
  }

  async remove(id: string): Promise<boolean> {
    const rows = await this.db
      .delete(this.table)
      .where(eq(this.table.id, id))
      .returning({ id: this.table.id });
    return rows.length > 0;
  }

  private toEntity(row: { id: string; data: unknown }): T {
    return { id: row.id, ...(row.data as object) } as T;
  }
}
