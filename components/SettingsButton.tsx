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
  const { setActivePlans, activePlans } = useCalculatedAssetStore();

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
    const storedShow = localStorage.getItem("showActionAssets");
    if (storedShow) {
      setActivePlans(JSON.parse(storedShow));
    }
  }, [setActivePlans]);

  const handleSetShow = (show: boolean) => {
    localStorage.setItem("showActionAssets", String(show));
    setActivePlans(show);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full">
        <Settings className="text-muted-foreground hover:opacity-70 transition-opacity duration-150 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          Time Horizon
        </DropdownMenuLabel>
        <Tabs
          defaultValue={String(year)}
          className="flex items-center space-x-2 mt-1"
        >
          <TabsList>
            <TabsTrigger value="5" onClick={() => handleSetYear(5)}>
              5
            </TabsTrigger>
            <TabsTrigger value="10" onClick={() => handleSetYear(10)}>
              10
            </TabsTrigger>
            <TabsTrigger value="25" onClick={() => handleSetYear(25)}>
              25
            </TabsTrigger>
            <TabsTrigger value="50" onClick={() => handleSetYear(50)}>
              50
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <DropdownMenuSeparator />

        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center justify-between text-sm">
            <p>Plan Assets</p>
            <Switch
              checked={activePlans}
              color="indigo"
              onChange={() => handleSetShow(!activePlans)}
            />
          </div>
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default SettingsButton;
