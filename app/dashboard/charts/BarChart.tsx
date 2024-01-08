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
import { useHorizonState, useUserState } from "@/store/store";
import {
  BarChart as BC,
  Card,
  EventProps,
  Subtitle,
  Title,
} from "@tremor/react";
import { useEffect, useState } from "react";
import { BarTooltip } from "./lib/BarTooltip";
import { usePlanStore, useSelectedPlanStore } from "@/store/planStore";
import DashboardAlert from "../components/DashboardAlert";

type EventPropsWithChartData = EventProps & BarChartData;

export default function BarChart() {
  const { user } = useUserState();
  const { assets } = useAssetStore();
  const { plans } = usePlanStore();
  const { year } = useHorizonState();
  const { selectedPlan } = useSelectedPlanStore();
  const {
    activePlans,
    activeInflation,
    setSingleYearCalculatedAsset,
    setBarChartActive,
  } = useCalculatedAssetStore();
  const { selectedAssets } = useSelectedAssetStore();
  const { barChartdata, barChartKey, setBarChartData } = useBarChartDataStore();
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
    console.log(category);
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
          if (selectedPlan) {
            return AssetsWithCategory.map((asset) =>
              calculateAsset(
                asset,
                year,
                [selectedPlan],
                selectedPlan,
                activeInflation
              )
            );
          } else {
            return AssetsWithCategory.map((asset) =>
              calculateAsset(asset, year, plans)
            );
          }
        } else {
          if (selectedPlan) {
            return assets.map((asset) =>
              calculateAsset(
                asset,
                year,
                [selectedPlan],
                selectedPlan,
                activeInflation
              )
            );
          } else {
            return assets.map((asset) => calculateAsset(asset, year, plans));
          }
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

    const calculateAltAssets = assets.map((asset) =>
      calculateAsset(
        asset,
        year,
        activePlans ? (selectedPlan ? [selectedPlan] : plans) : null,
        selectedPlan ? selectedPlan : null,
        activeInflation ? activeInflation : null
      )
    );

    const calculateAssetsWithAllocation = addProfitsToCurrency(
      calculatedAssets(),
      category === "currency" ? calculateAltAssets : null,
      activePlans ? plans : null,
      selectedPlan ? selectedPlan : null,
      activeInflation ? activeInflation : null
    );

    setSingleYearCalculatedAsset(singleYearCalc());
    setAreaChartData(convertToAreaChartData(calculateAssetsWithAllocation));
    console.log(calculateAssetsWithAllocation);
  };

  useEffect(() => {
    onValueChange({
      "Total value": 0,
      category: "",
      categoryClicked: "",
      eventType: "category",
    });
  }, [barChartKey]);

  return (
    <Card className="z-10">
      <div className="flex justify-between items-center">
        <Title>Assets</Title>
        <DashboardAlert />
      </div>

      <Subtitle>Value in {user?.currency.toUpperCase()}</Subtitle>

      <BC
        key={barChartKey}
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
