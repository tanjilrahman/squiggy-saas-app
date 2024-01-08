"use client";

import { DashboardTooltip } from "@/components/tooltips/DashboardTooltip";
import { useCarousel } from "@/components/ui/carousel";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CandlestickChart, Info, KanbanSquare, Route } from "lucide-react";
import { usePathname } from "next/navigation";

import React, { useEffect, useState } from "react";

type navType = "review" | "assets" | "plans";

function MenuBar({ nav }: { nav: navType }) {
  const { scrollNext, scrollPrev, canScrollNext, canScrollPrev } =
    useCarousel();
  const [active, setActive] = useState<navType>("review");
  const pathname = usePathname();

  useEffect(() => {
    setActive(nav);
  }, [nav]);

  if (pathname !== "/dashboard") return null;
  return (
    <div className="flex items-center">
      <Tabs defaultValue="review" value={nav} className="">
        <TabsList>
          <TabsTrigger
            value="review"
            onClick={() => {
              scrollPrev();
              scrollPrev();
              setActive("review");
            }}
          >
            <KanbanSquare
              className={`mr-2 h-4 w-4 ${
                active === "review" && "text-indigo-500"
              }`}
            />
            Review
          </TabsTrigger>
          <TabsTrigger
            value="assets"
            onClick={() => {
              canScrollNext && scrollNext();
              canScrollPrev && scrollPrev();
              setActive("assets");
            }}
          >
            <CandlestickChart
              className={`mr-2 h-4 w-4 ${
                active === "assets" && "text-indigo-500"
              }`}
            />
            Assets
          </TabsTrigger>
          <TabsTrigger
            value="plans"
            className="hover:bg-muted"
            onClick={() => {
              scrollNext();
              scrollNext();
              setActive("plans");
            }}
          >
            <Route
              className={`mr-2 h-4 w-4 ${
                active === "plans" && "text-indigo-500"
              }`}
            />
            Scenarios
          </TabsTrigger>
        </TabsList>
      </Tabs>
      <DashboardTooltip
        className="w-40"
        icon={
          <Info className="h-[18px] w-[18px] ml-3 text-muted-foreground/80 hover:text-muted-foreground cursor-pointer" />
        }
        text="Swipe the screen to change tabs"
      />
    </div>
  );
}

export default MenuBar;
