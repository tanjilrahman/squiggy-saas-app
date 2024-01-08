import React, { ReactElement } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
interface ReusableTooltipProps {
  icon: ReactElement;
  text: string;
  className?: string;
}

export function DashboardTooltip({
  icon,
  text,
  className,
}: ReusableTooltipProps): JSX.Element {
  return (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          {icon && React.cloneElement(icon)}
        </TooltipTrigger>
        <TooltipContent className={cn("text-center", className)}>
          <p>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
