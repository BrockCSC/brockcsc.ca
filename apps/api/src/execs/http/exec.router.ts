import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { requireAdmin } from "../../auth/application/auth.service.js";
import { createCrudRouter } from "../../shared/http/crud-router.js";
import { createExecUseCases } from "../application/exec-use-cases.js";
import { PostgresExecRepository } from "../infrastructure/exec.repository.js";

export const createExecRouter = (db: NodePgDatabase) => {
  const repository = new PostgresExecRepository(db);
  const useCases = createExecUseCases(repository);
  return createCrudRouter(useCases, requireAdmin);
};
