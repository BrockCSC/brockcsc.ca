export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <div
        className="
          bg-card
          rounded-2xl
          border-3 border-black
          shadow-[4px_4px_0px_var(--color-primary)]
          overflow-hidden
          transition-transform duration-300
          hover:scale-105
          cursor-pointer
        "
      >
        {/* Content Section */}
        <div className="p-6 flex flex-col items-center gap-2">{children}</div>
      </div>
    </div>
  );
}
