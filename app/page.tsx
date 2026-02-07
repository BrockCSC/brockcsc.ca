import { Navbar } from "@/components/ui/navbar";
import { HeroSection } from "@/components/section/hero";
import { UpcomingEventsSection } from "@/components/section/upcoming-events";
import { AboutSection } from "@/components/section/about";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-beige font-sans text-brand-text">
      
      {/* Navigation temporary for now */}
      <Navbar />

      <main>
        {/* Sections */}
        <HeroSection />
        <UpcomingEventsSection />
        <AboutSection />
      </main>

    </div>
  );
}