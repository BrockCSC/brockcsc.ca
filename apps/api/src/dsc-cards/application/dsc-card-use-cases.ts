import {
  CreateEntity,
  GetEntity,
  ListEntities,
  RemoveEntity,
  UpdateEntity,
} from "../../shared/application/crud-use-cases.js";
import type { DscCard, DscCardRepository } from "../domain/dsc-card.js";

export class ListDscCards extends ListEntities<DscCard> {}
export class GetDscCard extends GetEntity<DscCard> {}
export class CreateDscCard extends CreateEntity<DscCard> {}
export class UpdateDscCard extends UpdateEntity<DscCard> {}
export class DeleteDscCard extends RemoveEntity<DscCard> {}

export type DscCardUseCases = {
  list: ListDscCards;
  get: GetDscCard;
  create: CreateDscCard;
  update: UpdateDscCard;
  remove: DeleteDscCard;
};

export const createDscCardUseCases = (
  repository: DscCardRepository,
): DscCardUseCases => ({
  list: new ListDscCards(repository),
  get: new GetDscCard(repository),
  create: new CreateDscCard(repository),
  update: new UpdateDscCard(repository),
  remove: new DeleteDscCard(repository),
});
