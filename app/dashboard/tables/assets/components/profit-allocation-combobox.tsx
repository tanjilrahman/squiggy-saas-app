"use client";

import * as React from "react";
import { BadgeDollarSign, Check, ChevronsUpDown } from "lucide-react";

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

type PropsType = {
  disabled?: boolean;
  parentId?: string | null;
  assetId: string;
};

export function ProfitAllocationCombobox({
  disabled = false,
  assetId,
}: PropsType) {
  const { assets, updateAssetAllocation } = useAssetStore();
  const asset = assets.find((asset) => asset.id === assetId);

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(asset?.allocation);

  React.useEffect(() => {
    updateAssetAllocation(assetId, value!);
    console.log(value);
  }, [value]);

  React.useEffect(() => {
    setValue(asset?.allocation);
    console.log(assets.find((asset) => asset.id === assetId)?.allocation);
  }, [assets]);

  const selectedAsset = assets.find((asset) => asset.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
          disabled={disabled}
        >
          <div className="flex items-center">
            <BadgeDollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
            {value && selectedAsset
              ? "Profit Allocation - " +
                assets.find((asset) => asset.id === value)?.name
              : "Profit Allocation"}
          </div>

          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandEmpty>No asset found.</CommandEmpty>
          <CommandGroup>
            {assets?.map((asset) => {
              if (asset.category === "currency") {
                return (
                  <CommandItem
                    key={asset.id}
                    value={asset.id}
                    className="pr-8"
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === asset.name ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <BadgeDollarSign className="mr-2 h-4 w-4 text-muted-foreground" />
                    {asset.name}
                  </CommandItem>
                );
              }
            })}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
