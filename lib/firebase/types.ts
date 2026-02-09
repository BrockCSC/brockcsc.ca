export type WithKey<T> = T & { $key: string };

export type ExecRecord = {
  name?: string;
  title?: string;
  description?: string;
  isCurrentExec?: boolean;
  image?: {
    url?: string;
    name?: string;
    path?: string;
  };
};

export type EventRecord = {
  title?: string;
  description?: string;
  datetime?: {
    timeStartTimestamp?: number;
    timeEndTimestamp?: number;
  };
  dscEvent?: boolean;
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
