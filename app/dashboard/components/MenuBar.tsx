"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavState } from "@/store/store";
import { CandlestickChart, KanbanSquare, Route } from "lucide-react";
import { usePathname } from "next/navigation";

import React from "react";

function MenuBar() {
  const { nav, setNav } = useNavState();
  const pathname = usePathname();

  if (pathname !== "/dashboard") return null;
  return (
    <Tabs defaultValue="assets" className="">
      <TabsList>
        <TabsTrigger value="review" onClick={() => setNav("review")}>
          <KanbanSquare
            className={`mr-2 h-4 w-4 ${nav === "review" && "text-indigo-500"}`}
          />
          Review
        </TabsTrigger>
        <TabsTrigger value="assets" onClick={() => setNav("assets")}>
          <CandlestickChart
            className={`mr-2 h-4 w-4 ${nav === "assets" && "text-indigo-500"}`}
          />
          Assets
        </TabsTrigger>
        <TabsTrigger value="plans" onClick={() => setNav("plans")}>
          <Route
            className={`mr-2 h-4 w-4 ${nav === "plans" && "text-indigo-500"}`}
          />
          Plans
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export default MenuBar;
