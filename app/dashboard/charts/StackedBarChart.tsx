import {
  StackedChartData,
  convertToStackedChartData,
  formatValue,
} from "@/lib/helperFunctions";
import { useAssetStore, useSelectedAssetStore } from "@/store/assetStore";
import { Card, Title, BarChart, Subtitle } from "@tremor/react";
import { useEffect, useState } from "react";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import { StackedBarTooltip } from "./lib/StackedBarTooltip";
import { useAreaChartDataStore } from "@/store/chartStore";
import DashboardAlert from "../components/DashboardAlert";
import { useUserState } from "@/store/store";

export default function StackedBarChart() {
  const { user } = useUserState();
  const { assets } = useAssetStore();
  const [stackedChartdata, setStackedChartData] = useState<StackedChartData[]>(
    []
  );
  const { selectedAssets } = useSelectedAssetStore();
  const { yearSelected } = useAreaChartDataStore();
  const {
    activePlans,
    singleYearCalculatedAsset,
    setSingleYearCalculatedAsset,
  } = useCalculatedAssetStore();
  const pureAssets = assets.filter((asset) => !asset.action_asset);

  useEffect(() => {
    if (selectedAssets.length == 0) {
      setSingleYearCalculatedAsset(pureAssets);
    } else {
      setSingleYearCalculatedAsset(selectedAssets);
    }
  }, [assets, selectedAssets, activePlans]);

  useEffect(() => {
    setStackedChartData(
      convertToStackedChartData(singleYearCalculatedAsset, yearSelected)
    );
  }, [singleYearCalculatedAsset]);

  const onValueChange = () => {
    console.log(stackedChartdata);
  };

  return (
    <Card className="z-10">
      <div className="flex justify-between items-center">
        <Title>Cashflow</Title>
        <DashboardAlert />
      </div>

      <Subtitle>Value in {user?.currency.toUpperCase()}</Subtitle>
      <div className="flex items-center space-x-4 justify-end pt-4 px-4">
        <div className="flex items-center space-x-1">
          <div className="w-[8px] h-[8px] bg-[#0ea5e9] rounded-full" />
          <p className="text-sm text-dark-tremor-content">Passive</p>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-[8px] h-[8px] bg-[#8b5cf6] rounded-full" />
          <p className="text-sm text-dark-tremor-content">Mixed</p>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-[8px] h-[8px] bg-[#eab308] rounded-full" />
          <p className="text-sm text-dark-tremor-content">Active</p>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-[8px] h-[8px] bg-[#64748b] rounded-full" />
          <p className="text-sm text-dark-tremor-content">Sustain</p>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-[8px] h-[8px] bg-[#ec4899] rounded-full" />
          <p className="text-sm text-dark-tremor-content">Invest</p>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-[8px] h-[8px] bg-[#84cc16] rounded-full" />
          <p className="text-sm text-dark-tremor-content">Seed</p>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-[8px] h-[8px] bg-[#f97316] rounded-full" />
          <p className="text-sm text-dark-tremor-content">Margin</p>
        </div>
      </div>
      <BarChart
        className="mt-4 h-80"
        data={stackedChartdata}
        index="index"
        categories={[
          "Passive",
          "Mixed",
          "Active",
          "",
          "Sustain",
          "Invest",
          "Seed",
          "Margin",
        ]}
        colors={[
          "sky",
          "violet",
          "yellow",
          "rgba(0,0,0,0)",
          "slate",
          "pink",
          "lime",
          "orange",
        ]}
        showLegend={false}
        stack={true}
        valueFormatter={formatValue}
        yAxisWidth={40}
        showAnimation={true}
        onValueChange={onValueChange}
        // @ts-ignore
        customTooltip={StackedBarTooltip}
      />
    </Card>
  );
}
