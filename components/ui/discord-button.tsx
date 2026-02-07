/* JOIN DISCORD BUTTON */
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

interface DiscordButtonProps {
  className?: string;
}

export function DiscordButton({ className }: DiscordButtonProps) {
  return (
    <Button 
      size="lg" 
      variant="primary" 
      className={className}
    >
      Join Discord <ArrowUpRight className="ml-2" />
    </Button>
  );
}