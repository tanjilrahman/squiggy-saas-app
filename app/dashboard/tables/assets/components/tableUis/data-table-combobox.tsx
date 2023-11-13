"use client";

import * as React from "react";
import { Check, ChevronsUpDown, LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAssetStore } from "@/store/assetStore";

type Categories = {
  value: string;
  label: string;
  icon: any;
};

type PropsType = {
  parentId: string | null;
  type: "income" | "cost" | "parent";
  id: string;
  categories: Categories[];
  category: string;
};

export function DataTableCombobox({
  parentId,
  type,
  id,
  categories,
  category,
}: PropsType) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(category);
  const { updateAssetCategory, updateIncomeType, updateCostType } =
    useAssetStore();

  React.useEffect(() => {
    if (parentId === null && type === "parent") updateAssetCategory(id, value);
    if (type === "income" && parentId) updateIncomeType(parentId, id, value);
    if (type === "cost" && parentId) updateCostType(parentId, id, value);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? categories.find((category) => category.value === value)?.label
            : "Select category..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandEmpty>No category found.</CommandEmpty>
          <CommandGroup>
            {categories?.map((category) => (
              <CommandItem
                key={category.value}
                value={category.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === category.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {category.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
