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
import { Switch } from "@/components/ui/switch";
import { usePlanStore } from "@/store/planStore";

type InflationDialogProps = {
  children: JSX.Element;
  planId: string;
};

export function InflationDialog({ children, planId }: InflationDialogProps) {
  const [open, setOpen] = useState(false);
  const [enable, setEnable] = useState(false);
  const numYears = 50;
  const [inflationValues, setInflationValues] = useState<number[]>(
    Array(numYears).fill(0)
  );
  const { plans, updatePlanInflationMode, updatePlanInflationAdvanced } =
    usePlanStore();
  const plan = plans.find((plan) => plan.id === planId);

  useEffect(() => {
    if (plan?.inflation_advanced) {
      setInflationValues(plan.inflation_advanced);
    }
    setEnable(plan?.inflation_mode === "advanced");
  }, []);

  useEffect(() => {
    if (plan?.inflation_advanced) {
      setInflationValues(plan?.inflation_advanced);
    }
    setEnable(plan?.inflation_mode === "advanced");
  }, [plans.length]);

  useEffect(() => {
    updatePlanInflationMode(planId, enable ? "advanced" : "simple");

    if (enable) {
      updatePlanInflationAdvanced(planId, inflationValues);
    }
  }, [enable]);

  const currentYear = new Date().getFullYear();

  const handleInputChange = (index: number, value: number) => {
    const newValues = [...inflationValues];
    newValues[index] = value;
    setInflationValues(newValues);
  };

  const generateYearInputs = () => {
    return Array.from({ length: numYears }, (_, index) => {
      const lastNumber = inflationValues
        .filter((element) => typeof element === "number")
        .pop();
      const yearValue =
        inflationValues[index] !== undefined ? inflationValues[index] : "";

      return (
        <div key={index} className="text-center">
          <Label>{currentYear + index}</Label>
          <Input
            type="number"
            disabled={!enable}
            placeholder={lastNumber?.toString()}
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
    if (enable) {
      updatePlanInflationAdvanced(planId, inflationValues.slice(0, numYears));
    }
  }, [inflationValues, numYears]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="flex">
          <DialogTitle>Advance Inflation</DialogTitle>
          <DialogDescription>
            Enter the inflation for the next {numYears} years
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-end">
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
