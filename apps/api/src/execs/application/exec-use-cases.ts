import {
  CreateEntity,
  GetEntity,
  ListEntities,
  RemoveEntity,
  UpdateEntity,
} from "../../shared/application/crud-use-cases.js";
import type { Exec, ExecRepository } from "../domain/exec.js";

export class ListExecs extends ListEntities<Exec> {}
export class GetExec extends GetEntity<Exec> {}
export class CreateExec extends CreateEntity<Exec> {}
export class UpdateExec extends UpdateEntity<Exec> {}
export class DeleteExec extends RemoveEntity<Exec> {}

export type ExecUseCases = {
  list: ListExecs;
  get: GetExec;
  create: CreateExec;
  update: UpdateExec;
  remove: DeleteExec;
};

export const createExecUseCases = (
  repository: ExecRepository,
): ExecUseCases => ({
  list: new ListExecs(repository),
  get: new GetExec(repository),
  create: new CreateExec(repository),
  update: new UpdateExec(repository),
  remove: new DeleteExec(repository),
});
