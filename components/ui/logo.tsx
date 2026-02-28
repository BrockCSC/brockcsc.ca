export function Logo() {
  return (
    <div className="flex items-center gap-3 cursor-pointer">
      <div 
        className="flex items-center justify-center w-10 h-10 bg-[#9A4C46] border-[2px] border-black rounded-[5px]"
        style={{ boxShadow: '3px 3px 0px 0px rgba(0,0,0,1)' }}
      >
        <img 
          src="/logo-light.svg" 
          alt="Badger Logo" 
          className="w-[90%] h-[85%] object-contain" 
        />
      </div>
    </div>
  );
}