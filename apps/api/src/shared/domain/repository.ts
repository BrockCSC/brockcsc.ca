export interface Repository<T extends { id: string }> {
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(input: Omit<T, "id">): Promise<T>;
  update(id: string, patch: Partial<Omit<T, "id">>): Promise<T | null>;
  remove(id: string): Promise<boolean>;
}
