import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function MenuBarTooltip() {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-[18px] w-[18px] ml-3 text-muted-foreground/80 hover:text-muted-foreground cursor-pointer" />
        </TooltipTrigger>
        <TooltipContent className=" w-40 text-center">
          <p>Swipe the screen to change tabs</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
