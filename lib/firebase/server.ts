import { getFirebaseConfig } from "./config";

import type { EventRecord } from "./types";

export const fetchEventTitleByIdServer = async (
  eventId: string
): Promise<string | null> => {
  if (!eventId) {
    return null;
  }

  const { databaseURL } = getFirebaseConfig();
  if (!databaseURL) {
    return null;
  }

  try {
    const baseUrl = databaseURL.endsWith("/")
      ? databaseURL.slice(0, -1)
      : databaseURL;
    const response = await fetch(
      `${baseUrl}/event/${encodeURIComponent(eventId)}.json`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      return null;
    }

    const event = (await response.json()) as EventRecord | null;
    const title = event?.title?.trim();
    return title || null;
  } catch {
    return null;
  }
};
