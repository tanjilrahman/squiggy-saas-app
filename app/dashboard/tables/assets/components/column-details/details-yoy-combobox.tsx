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

const frameworks = [
  {
    value: "usd",
    label: "USD",
  },
  {
    value: "%",
    label: "%",
  },
];

type PropsType = {
  disabled?: boolean;
};

export function DetailsYoyCombobox({ disabled = false }: PropsType) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("usd");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between border-l-0 rounded-l-none disabled:opacity-100 disabled:bg-transparent disabled:border-transparent px-2"
          disabled={disabled}
        >
          {value &&
            frameworks.find((framework) => framework.value === value)?.label}

          <ChevronsUpDown
            className={`${
              disabled ? "opacity-0" : "opacity-50"
            } ml-2 h-4 w-4 shrink-0`}
          />
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
                  setValue(currentValue);
                  setOpen(false);
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
