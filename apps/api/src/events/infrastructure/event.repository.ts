import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DrizzleJsonRepository } from "../../shared/persistence/drizzle-json-repository.js";
import type { Event } from "../domain/event.js";
import { eventsTable } from "./event.schema.js";

export class PostgresEventRepository extends DrizzleJsonRepository<Event> {
  constructor(db: NodePgDatabase) {
    super(db, eventsTable);
  }
}
