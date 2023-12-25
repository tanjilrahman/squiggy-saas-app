import {
  AreaChartData,
  convertToAreaChartData,
  convertToChartData,
  formatValue,
} from "@/lib/helperFunctions";
import {
  AreaChart as AC,
  Card,
  EventProps,
  Subtitle,
  Title,
} from "@tremor/react";
import { useEffect } from "react";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import {
  useAreaChartDataStore,
  useBarChartDataStore,
} from "@/store/chartStore";
import { useAssetStore } from "@/store/assetStore";
import { useSelectedMiniPlanStore } from "@/store/planStore";
import DashboardAlert from "../components/DashboardAlert";

type EventPropsWithChartData = EventProps & AreaChartData;

export default function AreaChart() {
  const { assets } = useAssetStore();
  const { startTime } = useSelectedMiniPlanStore();
  const {
    calculatedAssets,
    activePlans,
    singleYearCalculatedAsset,
    barChartActive,
    setSingleYearCalculatedAsset,
  } = useCalculatedAssetStore();
  const {
    areaChartKey,
    areaChartdata,
    setAreaChartData,
    yearSelected,
    setYearSelected,
  } = useAreaChartDataStore();
  const { barChartdata, setBarChartData } = useBarChartDataStore();

  useEffect(() => {
    setAreaChartData(convertToAreaChartData(calculatedAssets));
    // console.log(areaChartData);
  }, [calculatedAssets]);

  const onValueChange = (value: EventPropsWithChartData) => {
    const year = value?.year - 2023;
    // console.log(year, value);
    setYearSelected(year ? year : null);
    const selectedYearAssets = calculatedAssets.map((assetYears) => {
      return assetYears.filter((_, i) => i === year);
    });
    // console.log(selectedYearAssets);

    const pureAssets = assets.filter((asset) => !asset.action_asset);
    const selectedWithoutPlanAssets = selectedYearAssets
      .flat()
      .filter((asset) => !asset.action_asset);

    let assetsToConvert;

    const selectedWithCategory = selectedYearAssets
      .flat()
      .filter(
        (asset) => singleYearCalculatedAsset[0]?.category === asset.category
      );

    if (year) {
      if (barChartActive) {
        assetsToConvert = selectedWithCategory;
      } else {
        if (activePlans) {
          assetsToConvert = selectedYearAssets.flat();
        } else {
          assetsToConvert = selectedWithoutPlanAssets;
        }
      }
    } else {
      if (barChartActive) {
        assetsToConvert = selectedWithCategory;
      } else {
        if (activePlans) {
          assetsToConvert = assets;
        } else {
          assetsToConvert = pureAssets;
        }
      }
      // console.log(selectedWithCategory);
    }

    setSingleYearCalculatedAsset(assetsToConvert);
    setBarChartData(convertToChartData(assetsToConvert));
  };

  useEffect(() => {
    if (startTime && !yearSelected) {
      // @ts-ignore
      onValueChange({ year: 2023 + startTime });
    }
    if (startTime === null) {
      // @ts-ignore
      onValueChange({ year: 2023 + 0 });
    }
  }, [startTime, areaChartKey]);
  return (
    <Card>
      <div className="flex justify-between items-center">
        <Title>Prognosis</Title>
        <DashboardAlert />
      </div>
      <Subtitle>Some text to add</Subtitle>
      <AC
        key={areaChartKey}
        className="mt-4"
        yAxisWidth={40}
        showAnimation={true}
        data={areaChartdata}
        index="year"
        categories={[
          "Total Asset Value",
          "Total Income",
          "Total Cost",
          "Asset YOY Increase",
        ]}
        colors={["indigo", "cyan", "amber", "blue"]}
        valueFormatter={formatValue}
        // @ts-ignore
        onValueChange={onValueChange}
      />
    </Card>
  );
}
