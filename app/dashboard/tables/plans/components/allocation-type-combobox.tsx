"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserState } from "@/store/store";

type PropsType = {
  className?: string;
  disabled?: boolean;
  value: string;
  setValue: (value: "%" | "fixed") => void;
};

export function AllocationTypeCombobox({
  className,
  disabled,
  value,
  setValue,
}: PropsType) {
  const [open, setOpen] = React.useState(false);
  const { user } = useUserState();

  const frameworks = [
    {
      value: "fixed",
      label: user?.currency.toUpperCase(),
    },
    {
      value: "%",
      label: "%",
    },
  ];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between px-3", className)}
          disabled={disabled}
        >
          {value &&
            frameworks.find((framework) => framework.value === value)?.label}

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[80px] p-0 ">
        <Command>
          <CommandGroup>
            {frameworks.map((framework) => (
              <CommandItem
                key={framework.value}
                value={framework.value}
                onSelect={(currentValue) => {
                  if (currentValue === "fixed" || currentValue === "%") {
                    setValue(currentValue as "fixed" | "%");
                    setOpen(false);
                  } else {
                    setValue("fixed");
                    setOpen(false);
                  }
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === framework.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {framework.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
