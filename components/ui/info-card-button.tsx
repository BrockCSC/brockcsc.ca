import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface InfoCardButtonProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  onClick?: () => void;
  // You might want to add 'href' later if these are links
}

export function InfoCardButton({ icon: Icon, title, subtitle, onClick }: InfoCardButtonProps) {
  return (
    <Button 
      variant="outline" 
      onClick={onClick}
      className="h-auto py-3 px-6 bg-white flex items-center justify-start gap-4 rounded-[16px] hover:bg-neutral-50 transition-colors"
    >
      <div className="p-2.5 bg-neutral-100 rounded-lg border border-neutral-200">
         <Icon className="size-5 text-brand-red" />
      </div>
      <div className="flex flex-col items-start gap-0.5">
         <span className="font-bold text-base text-black">{title}</span>
         <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider text-left">{subtitle}</span>
      </div>
    </Button>
  );
}