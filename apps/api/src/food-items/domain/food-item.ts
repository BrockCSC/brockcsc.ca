import type { Repository } from "../../shared/domain/repository.js";

export type FoodItem = {
  id: string;
  section?: string;
  item?: string;
  text?: string;
};

export type FoodItemRepository = Repository<FoodItem>;
