import {
  AreaChartData,
  convertToAreaChartData,
  convertToChartData,
  convertToStackedChartData,
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
  useStackedChartDataStore,
} from "@/store/chartStore";
import { useAssetStore } from "@/store/assetStore";
import { useSelectedMiniPlanStore } from "@/store/planStore";

type EventPropsWithChartData = EventProps & AreaChartData;

export default function AreaChart() {
  const { assets } = useAssetStore();
  const { startTime } = useSelectedMiniPlanStore();
  const { calculatedAssets, activePlans } = useCalculatedAssetStore();
  const { areaChartdata, setAreaChartData, yearSelected, setYearSelected } =
    useAreaChartDataStore();
  const { setBarChartData } = useBarChartDataStore();
  const { setStackedChartData } = useStackedChartDataStore();

  useEffect(() => {
    setAreaChartData(convertToAreaChartData(calculatedAssets));
    // console.log(areaChartData);
  }, [calculatedAssets]);

  const onValueChange = (value: EventPropsWithChartData) => {
    const year = value?.year - 2023;
    console.log(year, value);
    setYearSelected(year ? year : null);
    const selectedYearAssets = calculatedAssets.map((assetYears) => {
      return assetYears.filter((_, i) => i === year);
    });
    console.log(selectedYearAssets);

    const normalAssets = assets.filter((asset) => !asset.action_asset);
    const selectedWithoutPlanAssets = selectedYearAssets
      .flat()
      .filter((asset) => !asset.action_asset);

    const assetsToConvert = year
      ? activePlans
        ? selectedYearAssets.flat()
        : selectedWithoutPlanAssets
      : activePlans
      ? assets
      : normalAssets;

    setBarChartData(convertToChartData(assetsToConvert));
    setStackedChartData(convertToStackedChartData(assetsToConvert));
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
  }, [startTime]);
  return (
    <Card>
      <Title>Prognosis</Title>
      <Subtitle>Some text to add</Subtitle>
      <AC
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
