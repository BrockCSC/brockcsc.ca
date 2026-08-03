import type { Repository } from "../../shared/domain/repository.js";

export type EventRecurrence = {
  interval?: number;
  unit?: "day" | "week" | "month";
  byWeekday?: number[];
};

export type EventSchedule = {
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  recurrence?: EventRecurrence;
};

export type EventResource = {
  name?: string;
  url?: string;
};

export type EventImage = {
  url?: string;
  name?: string;
  path?: string;
};

export type Event = {
  id: string;
  title?: string;
  presenter?: string;
  description?: string;
  location?: string;
  signupUrl?: string;
  googleFormUrl?: string;
  tentative?: boolean;
  schedule?: EventSchedule;
  dscEvent?: boolean;
  resources?: EventResource[];
  gallery?: EventResource[];
  image?: EventImage;
};

export type EventRepository = Repository<Event>;
