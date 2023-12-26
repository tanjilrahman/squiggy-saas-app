import { addProfitsToCurrency, calculateAsset } from "@/lib/calc";
import {
  BarChartData,
  convertToAreaChartData,
  convertToChartData,
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
import { useEffect, useState } from "react";
import { BarTooltip } from "./lib/BarTooltip";
import { usePlanStore } from "@/store/planStore";
import DashboardAlert from "../components/DashboardAlert";

type EventPropsWithChartData = EventProps & BarChartData;

export default function BarChart() {
  const { assets } = useAssetStore();
  const { plans } = usePlanStore();
  const { year } = useHorizonState();
  const { activePlans, setSingleYearCalculatedAsset, setBarChartActive } =
    useCalculatedAssetStore();
  const { selectedAssets } = useSelectedAssetStore();
  const { barChartdata, setBarChartData } = useBarChartDataStore();
  const { yearSelected, setAreaChartData } = useAreaChartDataStore();
  const [barChartdataState, setBarChartDataState] = useState<BarChartData[]>(
    []
  );

  useEffect(() => {
    const pureAssets = assets.filter((asset) => !asset.action_asset);
    if (selectedAssets.length == 0) {
      setBarChartData(convertToChartData(pureAssets));
    } else {
      setBarChartData(convertToChartData(selectedAssets));
    }
  }, [assets, selectedAssets, activePlans]);

  useEffect(() => {
    setBarChartDataState(barChartdata);
  }, [barChartdata]);

  const onValueChange = (value: EventPropsWithChartData) => {
    if (yearSelected) return;
    const category = value?.category?.toLowerCase();
    if (category) {
      setBarChartActive(true);
    } else {
      setBarChartActive(false);
    }

    const pureAssets = assets.filter((asset) => !asset.action_asset);
    const pureAssetsWithCategory = assets.filter(
      (asset) => !asset.action_asset && asset.category === category
    );
    const AssetsWithCategory = assets.filter(
      (asset) => asset.category === category
    );

    const singleYearCalc = () => {
      if (activePlans) {
        if (category) {
          return AssetsWithCategory;
        } else {
          return assets;
        }
      } else {
        if (category) {
          return pureAssetsWithCategory;
        } else {
          return pureAssets;
        }
      }
    };

    const calculatedAssets = () => {
      if (activePlans) {
        if (category) {
          return AssetsWithCategory.map((asset) =>
            calculateAsset(asset, year, plans, assets)
          );
        } else {
          return assets.map((asset) =>
            calculateAsset(asset, year, plans, assets)
          );
        }
      } else {
        if (category) {
          return pureAssetsWithCategory.map((asset) =>
            calculateAsset(asset, year)
          );
        } else {
          return pureAssets.map((asset) => calculateAsset(asset, year));
        }
      }
    };

    const calculateAssetsWithAllocation = addProfitsToCurrency(
      calculatedAssets()
    );

    setSingleYearCalculatedAsset(singleYearCalc());
    setAreaChartData(convertToAreaChartData(calculateAssetsWithAllocation));
  };

  return (
    <Card className="z-10">
      <div className="flex justify-between items-center">
        <Title>Assets</Title>
        <DashboardAlert />
      </div>

      <Subtitle>Some text to add</Subtitle>

      <BC
        className="mt-6"
        data={barChartdataState}
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
