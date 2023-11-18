"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
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
  disabled?: boolean;
  parentId?: string | null;
  type?: "income" | "cost" | "parent";
  id: string;
  categories: Categories[];
  category: string;
};

export function DataTableCombobox({
  disabled = false,
  parentId = null,
  type = "parent",
  id,
  categories,
  category,
}: PropsType) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(category);
  const { assets, updateAssetCategory, updateIncomeType, updateCostType } =
    useAssetStore();

  React.useEffect(() => {
    if (parentId === null && type === "parent") updateAssetCategory(id, value);
    if (type === "income" && parentId) updateIncomeType(parentId, id, value);
    if (type === "cost" && parentId) updateCostType(parentId, id, value);
  }, [value]);

  React.useEffect(() => {
    setValue(category);
  }, [assets]);

  const selectedCategory = categories.find(
    (category) => category.value === value
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between  disabled:opacity-100 disabled:bg-transparent disabled:border-transparent"
          disabled={disabled}
        >
          <div className="flex items-center">
            {value && selectedCategory && (
              <selectedCategory.icon className="h-4 w-4 mr-2 text-muted-foreground" />
            )}
            {value && selectedCategory
              ? categories.find((category) => category.value === value)?.label
              : "Not Selected"}
          </div>

          {!disabled && (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[180px] p-0">
        <Command>
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
                {category.icon && (
                  <category.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                )}
                {category.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
