import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { requireAdmin } from "../../auth/application/auth.service.js";
import { createCrudRouter } from "../../shared/http/crud-router.js";
import { createFoodItemUseCases } from "../application/food-item-use-cases.js";
import { PostgresFoodItemRepository } from "../infrastructure/food-item.repository.js";

export const createFoodItemRouter = (db: NodePgDatabase) => {
  const repository = new PostgresFoodItemRepository(db);
  const useCases = createFoodItemUseCases(repository);
  return createCrudRouter(useCases, requireAdmin);
};
