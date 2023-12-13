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

type EventPropsWithChartData = EventProps & AreaChartData;

export default function AreaChart() {
  const { assets } = useAssetStore();
  const { calculatedAssets } = useCalculatedAssetStore();
  const { areaChartdata, setAreaChartData } = useAreaChartDataStore();
  const { setBarChartData } = useBarChartDataStore();
  const { setStackedChartData } = useStackedChartDataStore();

  useEffect(() => {
    setAreaChartData(convertToAreaChartData(calculatedAssets));
    // console.log(areaChartData);
  }, [calculatedAssets]);

  const onValueChange = (value: EventPropsWithChartData) => {
    const year = value?.year - 2023;
    console.log(year, value);
    const selectedYearAssets = calculatedAssets.map((assetYears) => {
      return assetYears.filter((_, i) => i === year);
    });
    console.log(selectedYearAssets);

    const normalAssets = assets.filter((asset) => asset.category);
    const selectedWithoutPlanAssets = selectedYearAssets
      .flat()
      .filter((asset) => asset.category);

    setBarChartData(
      convertToChartData(year ? selectedWithoutPlanAssets : normalAssets)
    );

    setStackedChartData(
      convertToStackedChartData(year ? selectedWithoutPlanAssets : normalAssets)
    );
  };
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
