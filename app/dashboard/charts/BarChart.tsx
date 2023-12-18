import { addProfitsToCurrency, calculateAsset } from "@/lib/calc";
import {
  BarChartData,
  convertToAreaChartData,
  convertToChartData,
  convertToStackedChartData,
  formatValue,
} from "@/lib/helperFunctions";
import { useAssetStore } from "@/store/assetStore";
import { useSelectedAssetStore } from "@/store/assetStore";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import {
  useAreaChartDataStore,
  useBarChartDataStore,
} from "@/store/chartStore";
import { useHorizonState } from "@/store/store";
import {
  BarChart as BC,
  Card,
  EventProps,
  Subtitle,
  Title,
} from "@tremor/react";
import { useEffect } from "react";
import { BarTooltip } from "./lib/BarTooltip";

type EventPropsWithChartData = EventProps & BarChartData;

export default function BarChart() {
  const { assets } = useAssetStore();
  const { year } = useHorizonState();
  const {
    activePlans,
    setActivePlans,
    barChartActive,
    singleYearCalculatedAsset,
    setSingleYearCalculatedAsset,
    setBarChartActive,
  } = useCalculatedAssetStore();
  const { selectedAssets } = useSelectedAssetStore();
  const { barChartdata, setBarChartData } = useBarChartDataStore();
  const { setAreaChartData } = useAreaChartDataStore();

  useEffect(() => {
    const pureAssets = assets.filter((asset) => !asset.action_asset);
    if (selectedAssets.length == 0) {
      setBarChartData(convertToChartData(activePlans ? assets : pureAssets));
    } else {
      setBarChartData(convertToChartData(selectedAssets));
    }
  }, [assets, selectedAssets, activePlans]);

  const onValueChange = (value: EventPropsWithChartData) => {
    const normalAssets = assets.filter((asset) => !asset.action_asset);
    const category = value?.category?.toLowerCase();
    if (category) {
      setBarChartActive(true);
    } else {
      setBarChartActive(false);
    }
    setActivePlans(false);

    const filteredAssetsWithCategory = assets.filter(
      (asset) => asset.category === category
    );

    const calculatedAssets = () => {
      const filteredPureAsset = assets.filter(
        (asset) =>
          !asset.action_asset && (category ? asset.category === category : true)
      );
      return filteredPureAsset.map((asset) => calculateAsset(asset, year));
    };

    const calculateAssetsWithAllocation = addProfitsToCurrency(
      calculatedAssets()
    );

    setSingleYearCalculatedAsset(
      category ? filteredAssetsWithCategory : normalAssets
    );
    setAreaChartData(convertToAreaChartData(calculateAssetsWithAllocation));
  };

  return (
    <Card className="z-10">
      <Title>Assets</Title>
      <Subtitle>Some text to add</Subtitle>
      <BC
        className="mt-6"
        data={barChartdata}
        index="category"
        categories={["Total value"]}
        colors={["indigo"]}
        valueFormatter={formatValue}
        yAxisWidth={40}
        showLegend={false}
        showAnimation={true}
        // @ts-ignore
        onValueChange={onValueChange}
        // @ts-ignore
        customTooltip={BarTooltip}
      />
    </Card>
  );
}
