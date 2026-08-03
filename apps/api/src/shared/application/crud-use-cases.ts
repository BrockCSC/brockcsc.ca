import type { Repository } from "../domain/repository.js";

export class ListEntities<T extends { id: string }> {
  constructor(protected readonly repository: Repository<T>) {}

  execute(): Promise<T[]> {
    return this.repository.findAll();
  }
}

export class GetEntity<T extends { id: string }> {
  constructor(protected readonly repository: Repository<T>) {}

  execute(id: string): Promise<T | null> {
    return this.repository.findById(id);
  }
}

export class CreateEntity<T extends { id: string }> {
  constructor(protected readonly repository: Repository<T>) {}

  execute(input: Omit<T, "id">): Promise<T> {
    return this.repository.create(input);
  }
}

export class UpdateEntity<T extends { id: string }> {
  constructor(protected readonly repository: Repository<T>) {}

  execute(id: string, patch: Partial<Omit<T, "id">>): Promise<T | null> {
    return this.repository.update(id, patch);
  }
}

export class RemoveEntity<T extends { id: string }> {
  constructor(protected readonly repository: Repository<T>) {}

  execute(id: string): Promise<boolean> {
    return this.repository.remove(id);
  }
}

export type CrudUseCases<T extends { id: string }> = {
  list: ListEntities<T>;
  get: GetEntity<T>;
  create: CreateEntity<T>;
  update: UpdateEntity<T>;
  remove: RemoveEntity<T>;
};
