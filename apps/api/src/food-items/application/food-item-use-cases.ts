import {
  CreateEntity,
  GetEntity,
  ListEntities,
  RemoveEntity,
  UpdateEntity,
} from "../../shared/application/crud-use-cases.js";
import type { FoodItem, FoodItemRepository } from "../domain/food-item.js";

export class ListFoodItems extends ListEntities<FoodItem> {}
export class GetFoodItem extends GetEntity<FoodItem> {}
export class CreateFoodItem extends CreateEntity<FoodItem> {}
export class UpdateFoodItem extends UpdateEntity<FoodItem> {}
export class DeleteFoodItem extends RemoveEntity<FoodItem> {}

export type FoodItemUseCases = {
  list: ListFoodItems;
  get: GetFoodItem;
  create: CreateFoodItem;
  update: UpdateFoodItem;
  remove: DeleteFoodItem;
};

export const createFoodItemUseCases = (
  repository: FoodItemRepository,
): FoodItemUseCases => ({
  list: new ListFoodItems(repository),
  get: new GetFoodItem(repository),
  create: new CreateFoodItem(repository),
  update: new UpdateFoodItem(repository),
  remove: new DeleteFoodItem(repository),
});
