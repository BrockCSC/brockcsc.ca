import React from 'react';
import { cn } from "@/lib/utils";

interface PhotoFrameProps {
  className?: string;
  children?: React.ReactNode;
}

export function PhotoFrame({ className, children }: PhotoFrameProps) {
  return (
    <div className={cn("relative w-full h-full", className)}>
      <div className="absolute inset-0 rounded-[32px] border-[3px] border-black bg-white rotate-2 shadow-[8px_8px_0_0_#9A4440] z-10 transition-transform hover:rotate-1 duration-500 overflow-hidden group">
        <div className="w-full h-full bg-neutral-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
           {children || (
             <span className="text-neutral-400 font-bold text-xl uppercase tracking-widest">Club Photo</span>
           )}
        </div>
      </div>
    </div>
  );
}