import { InfoCardButton } from "@/components/ui/info-card-button"; 
import { FileText, Users } from "lucide-react";

export function AboutSection() {
  return (
    <section className="px-6 py-20 lg:px-16 max-w-7xl mx-auto border-t-2 border-neutral-200/50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div className="flex flex-col gap-8">
          <h2 className="text-3xl md:text-4xl font-bold decoration-brand-red underline underline-offset-8">About Us</h2>
          
          <div className="space-y-6 text-lg text-neutral-600 leading-relaxed">
            <p>
                We are the <span className="font-bold text-brand-red">Brock Computer Science Club</span>. Our goal is to provide a community for all individuals who are interested in Computer Science at Brock University.
            </p>
            <p>
                Throughout the year, we host and participate in several educational and social events related to Computer Science. We bridge the gap between academic theory and practical application.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
             {/* Using the new Clean Components */}
             <InfoCardButton 
                icon={Users}
                title="Meet the Team"
                subtitle="Learn about our execs"
             />
             
             <InfoCardButton 
                icon={FileText}
                title="Club Charter"
                subtitle="Read our constitution"
             />
          </div>
        </div>

        {/* Visual Cluster Component */}
        <VisualCluster />
      </div>
    </section>
  );
}

// ... VisualCluster code remains the same ...
function VisualCluster() {
    return (
        <div className="relative h-[400px] w-full flex items-center justify-center select-none pointer-events-none">
            <div className="absolute size-28 sm:size-32 bg-brand-red border-2 border-black rounded-full shadow-neo flex items-center justify-center z-30 transition-transform hover:scale-110">
                <span className="font-bold text-white text-xl">All</span>
            </div>
            
            <div className="absolute top-10 left-4 sm:left-20 size-24 bg-white border-2 border-black rounded-full items-center justify-center shadow-neo flex overflow-hidden z-20 animate-pulse">
                <div className="bg-neutral-100 w-full h-full flex items-center justify-center">
                    <Users className="size-8 text-neutral-300" />
                </div>
            </div>
            
            <div className="absolute bottom-10 right-4 sm:right-20 size-28 bg-brand-text border-2 border-black rounded-full shadow-neo text-white flex items-center justify-center text-center text-xs p-2 z-20">
                <div className="flex flex-col items-center">
                    <span className="font-bold">Team</span>
                    <span className="text-[10px] opacity-70">Member</span>
                </div>
            </div>
            
            <div className="absolute top-0 right-10 sm:right-32 size-20 bg-white border-2 border-black rounded-full shadow-sm flex overflow-hidden z-10">
                <div className="bg-cinderella w-full h-full opacity-50"></div>
            </div>
            
            <div className="absolute bottom-20 left-10 sm:left-10 size-24 bg-tosca border-2 border-black rounded-full shadow-neo flex items-center justify-center text-white text-xs z-10">
                <span className="font-bold">Execs</span>
            </div>
        </div>
    );
}