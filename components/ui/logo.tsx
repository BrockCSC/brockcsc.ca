import React from 'react';

export function Logo() {
  return (
    <div className="flex items-center gap-3 cursor-pointer">
      {/* Box with solid offset shadow */}
      <div 
        className="flex items-center justify-center w-10 h-10 bg-[#9A4C46] border-[2px] border-black rounded-[6px]"
        style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
      >
        <img 
          src="/logo-white.svg" 
          alt="Badger Logo" 
          className="w-[75%] h-[75%] object-contain" 
        />
      </div>
      <span className="font-extrabold text-[#9A4C46] text-[22px] tracking-wide">
        BROCK CSC
      </span>
    </div>
  );
}