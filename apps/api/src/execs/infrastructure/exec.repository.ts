import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DrizzleJsonRepository } from "../../shared/persistence/drizzle-json-repository.js";
import type { Exec } from "../domain/exec.js";
import { execsTable } from "./exec.schema.js";

export class PostgresExecRepository extends DrizzleJsonRepository<Exec> {
  constructor(db: NodePgDatabase) {
    super(db, execsTable);
  }
}
