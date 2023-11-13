"use client";

import React, { useEffect } from "react";
import Plans from "@/app/dashboard/components/Plans";
import Review from "@/app/dashboard/components/Review";
import Assets from "@/app/dashboard/components/Assets";
import { useNavState } from "@/store/store";
import { Asset } from "../tables/assets/data/schema";
import { useAssetStore } from "@/store/assetStore";

function DashboardBody({ data }: { data: Asset[] }) {
  const { nav } = useNavState();
  const { setAssets } = useAssetStore();

  useEffect(() => {
    setAssets(data);
  }, [setAssets]);

  return (
    <div className="mx-auto">
      {nav == "assets" && <Assets />}

      {nav == "plans" && <Plans />}

      {nav == "review" && <Review />}
    </div>
  );
}

export default DashboardBody;
