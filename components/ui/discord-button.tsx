import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link"; // Import Link handling

interface DiscordButtonProps {
  className?: string;
}

export function DiscordButton({ className }: DiscordButtonProps) {
  return (
    
    <a 
        href="https://discord.com/invite/qsctEK2"  
        target="_blank" 
        rel="noopener noreferrer"
        className={className} 
    >
        <Button 
          size="lg" 
          variant="primary" 
          className="w-full sm:w-auto" 
        >
          Join Discord <ArrowUpRight className="ml-2" />
        </Button>
    </a>
  );
}