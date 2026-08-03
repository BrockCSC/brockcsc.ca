import {
  CreateEntity,
  GetEntity,
  ListEntities,
  RemoveEntity,
  UpdateEntity,
} from "../../shared/application/crud-use-cases.js";
import type { Event, EventRepository } from "../domain/event.js";

export class ListEvents extends ListEntities<Event> {}
export class GetEvent extends GetEntity<Event> {}
export class CreateEvent extends CreateEntity<Event> {}
export class UpdateEvent extends UpdateEntity<Event> {}
export class DeleteEvent extends RemoveEntity<Event> {}

export type EventUseCases = {
  list: ListEvents;
  get: GetEvent;
  create: CreateEvent;
  update: UpdateEvent;
  remove: DeleteEvent;
};

export const createEventUseCases = (
  repository: EventRepository,
): EventUseCases => ({
  list: new ListEvents(repository),
  get: new GetEvent(repository),
  create: new CreateEvent(repository),
  update: new UpdateEvent(repository),
  remove: new DeleteEvent(repository),
});
