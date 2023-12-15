"use client";

import React, { useEffect } from "react";
import Plans from "@/app/dashboard/components/Plans";
import Assets from "@/app/dashboard/components/Assets";
import { useHorizonState, useNavState } from "@/store/store";
import { Asset } from "../tables/assets/data/schema";
import { useAssetStore } from "@/store/assetStore";
import BarChart from "../charts/BarChart";
import StackedBarChart from "../charts/StackedBarChart";
import { Plan } from "../tables/plans/data/schema";
import { usePlanStore, useSelectedPlanStore } from "@/store/planStore";
import MiniPlans from "@/app/dashboard/components/MiniPlans";
import AreaChart from "../charts/AreaChart";
import { addProfitsToCurrency, calculateAsset } from "@/lib/calc";
import { useCalculatedAssetStore } from "@/store/calculationStore";

type DashboardBodyProps = {
  initialAssets: Asset[];
  initialPlans: Plan[];
};

function DashboardBody({ initialAssets, initialPlans }: DashboardBodyProps) {
  const { nav } = useNavState();
  const { year } = useHorizonState();
  const { assets, setAssets } = useAssetStore();
  const { plans } = usePlanStore();
  const { selectedPlan } = useSelectedPlanStore();
  const { activePlans, setCalculatedAssets, barChartActive } =
    useCalculatedAssetStore();
  const { setPlans } = usePlanStore();

  useEffect(() => {
    setAssets(initialAssets);
  }, [initialAssets]);

  useEffect(() => {
    setPlans(initialPlans);
  }, [initialPlans]);

  useEffect(() => {
    if (!barChartActive) {
      const calculatedAssets = () => {
        const filteredPureAsset = assets.filter((asset) => !asset.action_asset);

        if (activePlans || nav === "plans") {
          if (nav === "plans" && selectedPlan) {
            const assetInIds = selectedPlan.actions
              .map((action) =>
                action.assetIns.map((assetin) => assetin.assetId)
              )
              .flat();

            const assetIns = assets.filter((asset) =>
              assetInIds.includes(asset.id)
            );
            return assetIns.map((asset) => calculateAsset(asset, year, plans));
          }
          return assets.map((asset) => calculateAsset(asset, year, plans));
        } else {
          return filteredPureAsset.map((asset) => calculateAsset(asset, year));
        }
      };

      const calculateAssetsWithAllocation = addProfitsToCurrency(
        calculatedAssets()
      );

      setCalculatedAssets(calculateAssetsWithAllocation);
    }
  }, [assets, plans, year, activePlans, nav, selectedPlan]);

  return (
    <div className="mx-auto pt-4 p-8">
      {nav == "assets" && (
        <div className="space-y-8 mt-2">
          <div className="grid grid-cols-2 gap-8">
            <BarChart />
            <StackedBarChart />
          </div>

          <Assets />
        </div>
      )}

      {nav == "plans" && (
        <div className="space-y-8 mt-2">
          <AreaChart />
          <Plans />
        </div>
      )}

      {nav == "review" && (
        <div className="space-y-8 mt-2">
          <div className="grid grid-cols-2 gap-8">
            <BarChart />
            <AreaChart />
            <StackedBarChart />
            <MiniPlans />
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardBody;
