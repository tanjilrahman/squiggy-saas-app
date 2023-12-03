"use client";

import React, { useEffect } from "react";
import Plans from "@/app/dashboard/components/Plans";
import Review from "@/app/dashboard/components/Review";
import Assets from "@/app/dashboard/components/Assets";
import { useNavState } from "@/store/store";
import { Asset } from "../tables/assets/data/schema";
import { useAssetStore } from "@/store/assetStore";
import BarChart from "../charts/BarChart";
import StackedBarChart from "../charts/StackedBarChart";
import { Plan } from "../tables/plans/data/schema";
import { usePlanStore } from "@/store/planStore";

type DashboardBodyProps = {
  assets: Asset[];
  plans: Plan[];
};

function DashboardBody({ assets, plans }: DashboardBodyProps) {
  const { nav } = useNavState();
  const { setAssets } = useAssetStore();
  const { setPlans } = usePlanStore();

  useEffect(() => {
    setAssets(assets);
  }, [assets]);

  useEffect(() => {
    setPlans(plans);
  }, [plans]);

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

      {nav == "plans" && <Plans />}

      {nav == "review" && <Review />}
    </div>
  );
}

export default DashboardBody;
