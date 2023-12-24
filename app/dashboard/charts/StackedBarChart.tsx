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

export default function StackedBarChart() {
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
      setSingleYearCalculatedAsset(activePlans ? assets : pureAssets);
    } else {
      setSingleYearCalculatedAsset(selectedAssets);
    }
  }, [assets, selectedAssets, activePlans]);

  useEffect(() => {
    setStackedChartData(
      convertToStackedChartData(singleYearCalculatedAsset, yearSelected)
    );
  }, [singleYearCalculatedAsset]);

  return (
    <Card className="z-10">
      <Title className="flex justify-between items-center">
        <span>Margin</span>
        <DashboardAlert />
      </Title>
      <Subtitle>Some text to add</Subtitle>
      <BarChart
        className="mt-4 h-80"
        data={stackedChartdata}
        index="index"
        categories={[
          "Passive",
          "Mixed",
          "Active",
          "Sustain",
          "Invest",
          "Seed",
          "Margin",
        ]}
        colors={["sky", "violet", "yellow", "slate", "pink", "lime", "orange"]}
        stack={true}
        valueFormatter={formatValue}
        yAxisWidth={40}
        showAnimation={true}
        // @ts-ignore
        customTooltip={StackedBarTooltip}
      />
    </Card>
  );
}
