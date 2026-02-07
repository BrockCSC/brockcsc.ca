import React from "react";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface InfoCardButtonProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  href: string; 
}

export function InfoCardButton({ icon: Icon, title, subtitle, href }: InfoCardButtonProps) {
  return (
    <Button 
      asChild 
      variant="outline" 
      className="h-auto py-3 px-6 bg-white flex items-center justify-start gap-4 rounded-[16px] hover:bg-neutral-50 transition-colors"
    >
      <Link href={href}>
        <div className="p-2.5 bg-neutral-100 rounded-lg border border-neutral-200">
           <Icon className="size-5 text-brand-red" />
        </div>
        <div className="flex flex-col items-start gap-0.5">
           <span className="font-bold text-base text-black">{title}</span>
           <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider text-left">{subtitle}</span>
        </div>
      </Link>
    </Button>
  );
}