import { convertToStackedChartData, formatValue } from "@/lib/helperFunctions";
import { useAssetStore, useSelectedAssetStore } from "@/store/assetStore";
import { Card, Title, BarChart, Subtitle } from "@tremor/react";
import { useEffect } from "react";
import { useStackedChartDataStore } from "@/store/chartStore";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import { StackedBarTooltip } from "./lib/StackedBarTooltip";

export default function StackedBarChart() {
  const { assets } = useAssetStore();
  const { selectedAssets } = useSelectedAssetStore();
  const { activePlans } = useCalculatedAssetStore();
  const { stackedChartdata, setStackedChartData } = useStackedChartDataStore();
  const pureAssets = assets.filter((asset) => !asset.action_asset);

  useEffect(() => {
    if (selectedAssets.length == 0) {
      setStackedChartData(
        convertToStackedChartData(activePlans ? assets : pureAssets)
      );
    } else {
      setStackedChartData(convertToStackedChartData(selectedAssets));
    }
  }, [assets, selectedAssets, activePlans]);

  return (
    <Card className="z-10">
      <Title>Margin</Title>
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
