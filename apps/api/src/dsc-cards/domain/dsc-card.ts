import type { Repository } from "../../shared/domain/repository.js";

export type DscCardImage = {
  url?: string;
  name?: string;
  path?: string;
};

export type DscCard = {
  id: string;
  title?: string;
  text?: string;
  position?: number;
  img?: DscCardImage;
};

export type DscCardRepository = Repository<DscCard>;
