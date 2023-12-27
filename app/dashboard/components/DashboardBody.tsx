"use client";

import React, { useEffect, useState } from "react";
import { type CarouselApi } from "@/components/ui/carousel";
import Plans from "@/app/dashboard/components/Plans";
import Assets from "@/app/dashboard/components/Assets";
import { UserStateType, useHorizonState, useUserState } from "@/store/store";
import { Asset } from "../tables/assets/data/schema";
import { useAssetStore, useSelectedAssetStore } from "@/store/assetStore";
import BarChart from "../charts/BarChart";
import StackedBarChart from "../charts/StackedBarChart";
import { Plan } from "../tables/plans/data/schema";
import { usePlanStore, useSelectedPlanStore } from "@/store/planStore";
import MiniPlans from "@/app/dashboard/components/MiniPlans";
import AreaChart from "../charts/AreaChart";
import { addProfitsToCurrency, calculateAsset } from "@/lib/calc";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import MenuBar from "./MenuBar";

type DashboardBodyProps = {
  initialAssets: Asset[];
  initialPlans: Plan[];
  dbUser: UserStateType;
};

function DashboardBody({
  initialAssets,
  initialPlans,
  dbUser,
}: DashboardBodyProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [nav, setNav] = useState<"review" | "assets" | "plans">("review");
  const { year } = useHorizonState();
  const { assets, setAssets } = useAssetStore();
  const { selectedAssets } = useSelectedAssetStore();
  const { plans } = usePlanStore();
  const { selectedPlan } = useSelectedPlanStore();
  const { activePlans, activeInflation, setCalculatedAssets, barChartActive } =
    useCalculatedAssetStore();
  const { setPlans } = usePlanStore();

  const { setUser } = useUserState();

  useEffect(() => {
    dbUser &&
      setUser({
        currency: dbUser.currency,
        isPro: false,
      });
  }, [dbUser]);

  useEffect(() => {
    setAssets(initialAssets);
  }, [initialAssets]);

  useEffect(() => {
    setPlans(initialPlans);
  }, [initialPlans]);

  useEffect(() => {
    if (!barChartActive) {
      const calculatedAssets = () => {
        const activeAssets =
          selectedAssets.length > 0 ? selectedAssets : assets;
        const filteredPureAsset = activeAssets.filter(
          (asset) => !asset.action_asset
        );

        if (activePlans) {
          if (selectedPlan) {
            const assetInIds = selectedPlan.actions
              .map((action) => action.assetsIn.map((assetin) => assetin))
              .flat();

            const assetsIn = activeAssets.filter((asset) =>
              assetInIds.includes(asset.id)
            );
            return assetsIn.map((asset) =>
              calculateAsset(asset, year, plans, assets, activeInflation)
            );
          }
          return activeAssets.map((asset) =>
            calculateAsset(asset, year, plans, assets, activeInflation)
          );
        } else {
          return filteredPureAsset.map((asset) => calculateAsset(asset, year));
        }
      };

      const calculateAssetsWithAllocation = addProfitsToCurrency(
        calculatedAssets()
      );

      setCalculatedAssets(calculateAssetsWithAllocation);
    }
  }, [
    assets,
    plans,
    year,
    activePlans,
    activeInflation,
    selectedPlan,
    selectedAssets,
  ]);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      if (api.selectedScrollSnap() === 0) setNav("review");
      if (api.selectedScrollSnap() === 1) setNav("assets");
      if (api.selectedScrollSnap() === 2) setNav("plans");
    });
  }, [api]);

  return (
    <div>
      <Carousel className="w-full px-6 mx-auto" setApi={setApi}>
        <div className="fixed z-10 transform -translate-x-1/2 top-6 left-1/2 ml-[18px]">
          <MenuBar nav={nav} />
        </div>
        <CarouselContent>
          <CarouselItem>
            <div className="p-1 mt-2 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <BarChart />
                <AreaChart />
                <StackedBarChart />
                <MiniPlans />
              </div>
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-1 mt-2 space-y-8">
              <div className="grid grid-cols-2 gap-8">
                <BarChart />
                <StackedBarChart />
              </div>

              <Assets />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-1 mt-2 space-y-8">
              <AreaChart />
              <Plans />
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="flex items-center -ml-2 transition-all duration-150 rounded-lg cursor-pointer top-96 h-52 w-14 bg-muted/50 hover:bg-muted" />

        <CarouselNext className="flex items-center -mr-2 transition-all duration-150 rounded-lg cursor-pointer top-96 h-52 w-14 bg-muted/50 hover:bg-muted" />
      </Carousel>
    </div>
  );
}

export default DashboardBody;
