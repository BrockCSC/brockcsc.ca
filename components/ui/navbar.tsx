'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './logo';
import { DiscordButton } from './discord-button';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Team', href: '/team' },
    { name: 'Events', href: '/events' },
    { name: 'CS Guide', href: '/cs-guide' },
  ];

  return (
    <nav className="h-20 w-full border-b-2 border-black bg-white">
        <div className="mx-auto flex h-full w-full max-w-[1060px] items-center justify-between px-5">
            <Link href="/" className="flex items-center gap-3 cursor-pointer">
              <Logo />
              <span className="font-bold text-[#9A4C46] text-[22px] tracking-wide">
                BROCK CSC
              </span>
            </Link>

            <div className="flex items-center gap-8 text-[15px] font-bold text-[#1a1a1a]">
                {navLinks.map((link) => {
                  // current route matching the link's href
                  const isActive = pathname === link.href;
                  
                  return (
                    <Link 
                      key={link.name}
                      href={link.href} 
                      className={cn(
                        "hover:text-[#9A4C46] transition-colors pb-1 border-b-2 border-transparent",
                        isActive && "text-[#9A4C46] border-[#9A4C46]"
                      )}
                    >
                      {link.name}
                    </Link>
                  );
                })}
                
                <DiscordButton className="ml-2" />
            </div>
        </div>
    </nav>
  );
}
