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

type YoyDialogProps = {
  children: JSX.Element;
};

export function DetailsYoyDialog({ children }: YoyDialogProps) {
  const [open, setOpen] = useState(false);
  const [enable, setEnable] = useState(false);
  const [numYears, setNumYears] = useState(5);
  const [yoyValues, setYoyValues] = useState<string[]>(
    Array(numYears).fill("")
  );

  useEffect(() => {
    console.log(yoyValues);
  }, [yoyValues]);
  const currentYear = new Date().getFullYear();

  const handleInputChange = (index: number, value: string) => {
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
            className="w-[70px] h-[35px] p-2 mt-2"
            value={yearValue}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        </div>
      );
    });
  };

  useEffect(() => {
    // Update the number of years when the button is clicked
    setYoyValues(Array(numYears).fill(""));
  }, [numYears]);

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
          <Tabs defaultValue="5" className="flex items-center">
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
