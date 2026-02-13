import type { Metadata } from "next";

import { fetchEventTitleByIdServer } from "@/lib/firebase";

import EventDetailPageClient from "./pageClient";

type EventDetailPageProps = {
  params: Promise<{ eventId: string }>;
};

export async function generateMetadata({
  params,
}: EventDetailPageProps): Promise<Metadata> {
  const { eventId } = await params;
  const eventTitle = await fetchEventTitleByIdServer(eventId);

  return {
    title: eventTitle ?? "Event",
  };
}

export default function EventDetailPage() {
  return <EventDetailPageClient />;
}
