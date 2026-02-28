import { Logo } from './logo';
import { DiscordButton } from './discord-button';

export function Navbar() {
  return (
    <nav className="w-full h-20 bg-white border-b-2 border-black">
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
            <Logo />

            <div className="flex items-center gap-8 text-[15px] font-bold text-[#1a1a1a]">
                <a href="#" className="hover:text-[#9A4C46] transition-colors">Home</a>
                <a href="#" className="text-[#9A4C46] border-b-2 border-[#9A4C46] pb-1">Team</a>
                <a href="#" className="hover:text-[#9A4C46] transition-colors">Events</a>
                <a href="#" className="hover:text-[#9A4C46] transition-colors">CS Guide</a>
                
                <DiscordButton className="ml-2" />
            </div>
        </div>
    </nav>
  );
}