export type WithKey<T> = T & { $key: string };

export type ExecSocialLinks = {
  linkedin?: string;
  instagram?: string;
  x?: string;
};

export type ExecRecord = {
  name?: string;
  title?: string;
  description?: string;
  isCurrentExec?: boolean;
  socials?: ExecSocialLinks;
  linkedin?: string;
  linkedinUrl?: string;
  instagram?: string;
  instagramUrl?: string;
  x?: string;
  xUrl?: string;
  image?: {
    url?: string;
    name?: string;
    path?: string;
  };
};

export type EventRecord = {
  title?: string;
  presenter?: string;
  description?: string;
  location?: string;
  signupUrl?: string;
  googleFormUrl?: string;
  tentative?: boolean;
  schedule?: {
    startDate?: string;
    endDate?: string;
    startTime?: string;
    endTime?: string;
    recurrence?: {
      interval?: number;
      unit?: "day" | "week" | "month";
      byWeekday?: number[];
    };
  };
  dscEvent?: boolean;
  resources?: Array<{
    name?: string;
    url?: string;
  }>;
  gallery?: Array<{
    name?: string;
    url?: string;
  }>;
  image?: {
    url?: string;
    name?: string;
    path?: string;
  };
};

export type DscCardRecord = {
  title?: string;
  text?: string;
  position?: number;
  img?: {
    url?: string;
    name?: string;
    path?: string;
  };
};

export type FoodRecord = {
  section?: string;
  item?: string;
  text?: string;
};
