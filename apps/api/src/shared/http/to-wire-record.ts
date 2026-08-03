export const toWireRecord = <T extends { id: string }>(entity: T) => {
  const { id, ...rest } = entity;
  return { $key: id, ...rest };
};
