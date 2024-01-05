"use client";

import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { useHorizonState } from "@/store/store";
import { Switch } from "@tremor/react";
import { useCalculatedAssetStore } from "@/store/calculationStore";

function SettingsButton() {
  const { setYear, year } = useHorizonState();
  const { setActiveInflation, activeInflation } = useCalculatedAssetStore();

  useEffect(() => {
    const storedYear = localStorage.getItem("selectedYear");
    if (storedYear) {
      setYear(parseInt(storedYear, 10));
    }
  }, [setYear]);

  const handleSetYear = (newYear: number) => {
    localStorage.setItem("selectedYear", String(newYear));
    setYear(newYear);
  };

  useEffect(() => {
    const storedShow = localStorage.getItem("inflation");
    if (storedShow) {
      setActiveInflation(JSON.parse(storedShow));
    }
  }, [setActiveInflation]);

  const handleSetInflation = (show: boolean) => {
    localStorage.setItem("inflation", String(show));
    setActiveInflation(show);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Settings className="text-muted-foreground hover:opacity-70 transition-opacity duration-150 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-52" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          Time Horizon
        </DropdownMenuLabel>
        <Tabs
          defaultValue={String(year)}
          className="items-center space-x-2 mt-1"
        >
          <TabsList className="w-full">
            <TabsTrigger
              className="w-full"
              value="5"
              onClick={() => handleSetYear(5)}
            >
              5
            </TabsTrigger>
            <TabsTrigger
              className="w-full"
              value="10"
              onClick={() => handleSetYear(10)}
            >
              10
            </TabsTrigger>
            <TabsTrigger
              className="w-full"
              value="25"
              onClick={() => handleSetYear(25)}
            >
              25
            </TabsTrigger>
            <TabsTrigger
              className="w-full"
              value="50"
              onClick={() => handleSetYear(50)}
            >
              50
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center justify-between text-sm">
            <p>Inflation Adjustment</p>
            <Switch
              checked={activeInflation}
              color="indigo"
              onChange={() => handleSetInflation(!activeInflation)}
            />
          </div>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SettingsButton;
