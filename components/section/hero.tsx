import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhotoFrame } from "@/components/ui/photo-frame";
import { MemberBadge } from "@/components/ui/member-badge";
import { DiscordButton } from "@/components/ui/discord-button";

export function HeroSection() {
  return (
    <section className="relative px-6 py-16 md:py-24 lg:px-16 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="flex flex-col items-start gap-6">
            <div className="relative">
                <Badge variant="neutral">Welcome to the club</Badge>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Brock <br />
            <span className="underline decoration-brand-red decoration-4 underline-offset-4 text-brand-red" >Computer</span> <br />
            Science Club
            </h1>

            <div className="flex gap-4 border-l-4 border-brand-red pl-6 py-1">
            <p className="text-lg md:text-xl text-neutral-600 max-w-md leading-relaxed">
                Aiming to foster a community for individuals at Brock University interested in Computer Science. Code, connect, and create with us.
            </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
                <DiscordButton className="w-full sm:w-auto" />
                
                <Button variant="outline" size="lg" className="bg-white w-full sm:w-auto">
                    Learn More
                </Button>
            </div>
        </div>

        {/* Right Image/Frame */}
        <div className="relative w-full aspect-[4/3] lg:aspect-square max-h-[500px]">
            <PhotoFrame />
            <MemberBadge className="absolute -bottom-4 -right-4 z-20" />
        </div>
      </div>
    </section>
  );
}