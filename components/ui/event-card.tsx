import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUpRight } from 'lucide-react';

interface EventCardProps {
  title: string;
  description: string;
  bgColor?: string; 
  tags: {
    label: string;
    icon?: React.ReactNode;
  }[];
}

export function EventCard({ 
  title, 
  description, 
  bgColor = "bg-brand-beige",
  tags,
}: EventCardProps) {
  return (
    <div className="w-full flex flex-col rounded-[24px] border-2 border-black bg-white p-2 shadow-neo overflow-hidden h-full transform transition-transform hover:-translate-y-1 hover:shadow-[6px_6px_0_0_#000] duration-300">
      {/* Image / Graphic Container */}
      <div className={`relative w-full aspect-video rounded-[16px] border-2 border-black overflow-hidden ${bgColor} flex items-center justify-center`}>
        <div className="flex items-center justify-center p-4">
             <div className="relative size-24 rounded-full border-2 border-white/20 bg-white/10 flex items-center justify-center backdrop-blur-sm">
                <div className="text-center font-bold text-black/50 uppercase tracking-widest text-xs">
                    {title.split(' ')[0]}
                </div>
             </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 pt-6 gap-4">
        <div>
          <h3 className="text-2xl font-bold leading-tight mb-2 font-sans">{title}</h3>
          <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {tags.map((tag, i) => (
            <Badge key={i} variant="default" size="sm" className="rounded-md">
              {tag.icon && <span className="mr-1.5 [&>svg]:size-3">{tag.icon}</span>}
              {tag.label}
            </Badge>
          ))}
        </div>

        <Button className="w-full mt-2 h-10 text-sm" variant="primary">
          More Info <ArrowUpRight className="ml-2 size-4" />
        </Button>
      </div>
    </div>
  );
}