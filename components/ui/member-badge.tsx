/* the 200+ members bragging tag shown on homepage again and some other pages inn figma  */
import { cn } from "@/lib/utils";

interface MemberBadgeProps {
  count?: string;
  className?: string;
}

export function MemberBadge({ count = "200+", className }: MemberBadgeProps) {
  return (
    <div className={cn("flex items-center gap-2 rounded-full border-2 border-black bg-brand-red px-6 py-3 text-white shadow-neo transition-transform hover:scale-105", className)}>
      <span className="font-mono font-bold text-lg">&lt;&gt;</span>
      <span className="font-bold">{count} Members</span>
    </div>
  );
}