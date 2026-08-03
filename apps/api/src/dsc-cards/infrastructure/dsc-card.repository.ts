import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DrizzleJsonRepository } from "../../shared/persistence/drizzle-json-repository.js";
import type { DscCard } from "../domain/dsc-card.js";
import { dscCardsTable } from "./dsc-card.schema.js";

export class PostgresDscCardRepository extends DrizzleJsonRepository<DscCard> {
  constructor(db: NodePgDatabase) {
    super(db, dscCardsTable);
  }
}
