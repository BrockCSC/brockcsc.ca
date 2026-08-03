import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { requireAdmin } from "../../auth/application/auth.service.js";
import { createCrudRouter } from "../../shared/http/crud-router.js";
import { createEventUseCases } from "../application/event-use-cases.js";
import { PostgresEventRepository } from "../infrastructure/event.repository.js";

export const createEventRouter = (db: NodePgDatabase) => {
  const repository = new PostgresEventRepository(db);
  const useCases = createEventUseCases(repository);
  return createCrudRouter(useCases, requireAdmin);
};
