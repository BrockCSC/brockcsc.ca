import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { DrizzleJsonRepository } from "../../shared/persistence/drizzle-json-repository.js";
import type { FoodItem } from "../domain/food-item.js";
import { foodItemsTable } from "./food-item.schema.js";

export class PostgresFoodItemRepository extends DrizzleJsonRepository<FoodItem> {
  constructor(db: NodePgDatabase) {
    super(db, foodItemsTable);
  }
}
