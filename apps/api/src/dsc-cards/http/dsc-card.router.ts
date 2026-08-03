import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { requireAdmin } from "../../auth/application/auth.service.js";
import { createCrudRouter } from "../../shared/http/crud-router.js";
import { createDscCardUseCases } from "../application/dsc-card-use-cases.js";
import { PostgresDscCardRepository } from "../infrastructure/dsc-card.repository.js";

export const createDscCardRouter = (db: NodePgDatabase) => {
  const repository = new PostgresDscCardRepository(db);
  const useCases = createDscCardUseCases(repository);
  return createCrudRouter(useCases, requireAdmin);
};
