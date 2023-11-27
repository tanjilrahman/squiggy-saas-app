import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAssetStore } from "@/store/assetStore";
import { DetailsYoyCombobox } from "./details-yoy-combobox";

type YoyDialogProps = {
  children: JSX.Element;
  assetId: string;
  itemId: string;
  type: "income" | "cost";
};

export function DetailsYoyDialog({
  children,
  assetId,
  itemId,
  type,
}: YoyDialogProps) {
  const [open, setOpen] = useState(false);
  const [enable, setEnable] = useState(false);
  const [numYears, setNumYears] = useState(5);
  const [yoyValues, setYoyValues] = useState<number[]>(
    Array(numYears).fill("")
  );
  const {
    assets,
    updateIncomeYoyMode,
    updateIncomeYoyAdvanced,
    updateCostYoyMode,
    updateCostYoyAdvanced,
  } = useAssetStore();
  const asset = assets.find((asset) => asset.id === assetId);
  const income = asset?.incomes.find((item) => item.id === itemId);
  const cost = asset?.costs.find((item) => item.id === itemId);

  useEffect(() => {
    if (type === "income") {
      if (income?.yoy_advanced) {
        setYoyValues(income.yoy_advanced);
      }
      setEnable(income?.yoy_mode === "advanced");
    } else {
      if (cost?.yoy_advanced) {
        setYoyValues(cost.yoy_advanced);
      }
      setEnable(cost?.yoy_mode === "advanced");
    }
  }, []);

  useEffect(() => {
    if (type === "income") {
      if (income?.yoy_advanced) {
        setYoyValues(income.yoy_advanced);
      }
      setEnable(income?.yoy_mode === "advanced");
    } else {
      if (cost?.yoy_advanced) {
        setYoyValues(cost.yoy_advanced);
      }
      setEnable(cost?.yoy_mode === "advanced");
    }
  }, [assets.length]);

  useEffect(() => {
    if (type === "income") {
      updateIncomeYoyMode(assetId, itemId, enable ? "advanced" : "simple");

      if (enable) {
        updateIncomeYoyAdvanced(assetId, itemId, yoyValues);
      }
    } else {
      updateCostYoyMode(assetId, itemId, enable ? "advanced" : "simple");

      if (enable) {
        updateCostYoyAdvanced(assetId, itemId, yoyValues);
      }
    }
  }, [enable]);

  const currentYear = new Date().getFullYear();

  const handleInputChange = (index: number, value: number) => {
    const newValues = [...yoyValues];
    newValues[index] = value;
    setYoyValues(newValues);
  };

  const generateYearInputs = () => {
    return Array.from({ length: numYears }, (_, index) => {
      const yearValue = yoyValues[index] !== undefined ? yoyValues[index] : "";

      return (
        <div key={index} className="text-center">
          <Label>{currentYear + index}</Label>
          <Input
            disabled={!enable}
            className="w-[70px] h-[35px] p-2 mt-2 [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
            value={yearValue}
            onChange={(e) => handleInputChange(index, +e.target.value)}
          />
        </div>
      );
    });
  };

  useEffect(() => {
    // Update the number of years when the button is clicked
    if (type === "income") {
      if (enable) {
        updateIncomeYoyAdvanced(assetId, itemId, yoyValues.slice(0, numYears));
      }
    } else {
      if (enable) {
        updateCostYoyAdvanced(assetId, itemId, yoyValues.slice(0, numYears));
      }
    }
  }, [yoyValues, numYears]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Advance YOY Change</DialogTitle>
          <DialogDescription>
            Enter the yoy change for the next {numYears} years
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <Tabs defaultValue="5" className="flex items-center space-x-2">
            <TabsList>
              <TabsTrigger value="5" onClick={() => setNumYears(5)}>
                5
              </TabsTrigger>
              <TabsTrigger value="10" onClick={() => setNumYears(10)}>
                10
              </TabsTrigger>
              <TabsTrigger value="25" onClick={() => setNumYears(25)}>
                25
              </TabsTrigger>
              <TabsTrigger value="50" onClick={() => setNumYears(50)}>
                50
              </TabsTrigger>
            </TabsList>
            <DetailsYoyCombobox assetId={assetId} itemId={itemId} type={type} />
          </Tabs>
          <div className="flex items-center">
            <Label className="mr-2">{enable ? "Enabled" : "Disabled"}</Label>
            <Switch
              checked={enable}
              onCheckedChange={() => setEnable(!enable)}
            />
          </div>
        </div>

        <ScrollArea type="always" className="w-full">
          <div className="flex space-x-2 px-1 pb-4">{generateYearInputs()}</div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
