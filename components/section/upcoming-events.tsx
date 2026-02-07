import Link from "next/link";
import { EventCard } from "@/components/ui/event-card";
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";

export function UpcomingEventsSection() {
  return (
    <section className="px-6 py-20 lg:px-16 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div className="max-w-xl">
           <div className="flex items-center gap-3 mb-4">
              <div className="size-4 rounded-full border-2 border-brand-red bg-transparent"></div>
              <h2 className="text-3xl md:text-4xl font-bold">Upcoming Events</h2>
           </div>
           <p className="text-neutral-600 text-lg">
              From board games to first-person shooters, tech talks to social mixers. High contrast events for high impact learning.
           </p>
        </div>
        
      
        <Link href="/events" className="text-brand-red font-bold hover:underline inline-flex items-center gap-1">
           View Calendar <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* WILL NEED TO LINK THIS TO FIREBASE PLACE HOLDER FOR NOw */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <EventCard 
          title="Gaming Nights"
          description="Join us for our weekly gaming sessions. From competitive tournaments to casual play."
          bgColor="bg-sage"
          tags={[
             { label: "FRIDAY", icon: <Calendar /> },
             { label: "6:00 PM", icon: <Clock /> },
             { label: "MCJ 320", icon: <MapPin /> },
          ]}
        />
        <EventCard 
          title="Tech Talks"
          description="Deep dives into software development, AI, and industry trends with guest speakers."
          bgColor="bg-tosca"
          tags={[
             { label: "TUESDAY", icon: <Calendar /> },
             { label: "5:00 PM", icon: <Clock /> },
             { label: "TH 245", icon: <MapPin /> },
          ]}
        />
      </div>
    </section>
  );
}