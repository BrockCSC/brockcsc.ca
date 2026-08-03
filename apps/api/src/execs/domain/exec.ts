import type { Repository } from "../../shared/domain/repository.js";

export type ExecSocialLinks = {
  github?: string;
  linkedin?: string;
  instagram?: string;
  x?: string;
};

export type ExecImage = {
  url?: string;
  name?: string;
  path?: string;
};

export type Exec = {
  id: string;
  name?: string;
  title?: string;
  description?: string;
  isCurrentExec?: boolean;
  socials?: ExecSocialLinks;
  image?: ExecImage;
};

export type ExecRepository = Repository<Exec>;
