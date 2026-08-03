import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface DiscordButtonProps {
  className?: string;
}

export function DiscordButton({ className }: DiscordButtonProps) {
  return (
    <Button
      asChild
      size="lg"
      variant="primary"
      className={cn("w-full cursor-pointer sm:w-auto", className)}
    >
      <a
        href="https://discord.com/invite/qsctEK2"
        target="_blank"
        rel="noopener noreferrer"
      >
        Join Discord <ArrowUpRight className="ml-2" />
      </a>
    </Button>
  );
}
