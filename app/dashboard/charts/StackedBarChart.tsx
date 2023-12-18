import { convertToStackedChartData, formatValue } from "@/lib/helperFunctions";
import { useAssetStore, useSelectedAssetStore } from "@/store/assetStore";
import { Card, Title, BarChart, Subtitle } from "@tremor/react";
import { useEffect } from "react";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import { StackedBarTooltip } from "./lib/StackedBarTooltip";
import { useAreaChartDataStore } from "@/store/chartStore";

export default function StackedBarChart() {
  const { assets } = useAssetStore();
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

  return (
    <Card className="z-10">
      <Title>Margin</Title>
      <Subtitle>Some text to add</Subtitle>
      <BarChart
        className="mt-4 h-80"
        data={convertToStackedChartData(
          singleYearCalculatedAsset,
          yearSelected
        )}
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
