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
import { useAssetStore } from "@/store/assetStore";

const frameworks = [
  {
    value: "fixed",
    label: "USD",
  },
  {
    value: "%",
    label: "%",
  },
];

type PropsType = {
  className?: string;
  disabled?: boolean;
  assetId: string;
  itemId: string;
  type: "income" | "cost";
};

export function DetailsYoyCombobox({
  className,
  disabled = false,
  assetId,
  itemId,
  type,
}: PropsType) {
  const { assets, updateIncomeYoyType, updateCostYoyType } = useAssetStore();
  const asset = assets.find((asset) => asset.id === assetId);
  const income = asset?.incomes.find((item) => item.id === itemId);
  const cost = asset?.costs.find((item) => item.id === itemId);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(
    type === "income" ? income?.yoy_type! : cost?.yoy_type!
  );

  React.useEffect(() => {
    if (type === "income") {
      updateIncomeYoyType(assetId, itemId, value);
    } else {
      updateCostYoyType(assetId, itemId, value);
    }
  }, [value]);

  React.useEffect(() => {
    if (type === "income") {
      setValue(income?.yoy_type!);
    } else {
      setValue(cost?.yoy_type!);
    }
  }, [assets]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            `${
              disabled && "hidden"
            } justify-between disabled:opacity-100 disabled:bg-transparent disabled:border-transparent px-3 `,
            className
          )}
          disabled={disabled}
        >
          <p className="ml-auto">
            {value &&
              frameworks.find((framework) => framework.value === value)?.label}
          </p>

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
