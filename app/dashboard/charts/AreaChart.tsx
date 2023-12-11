import { convertToAreaChartData, formatValue } from "@/lib/helperFunctions";
import { AreaChart as AC, Card, Subtitle, Title } from "@tremor/react";
import { useEffect } from "react";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import { useAreaChartDataStore } from "@/store/chartStore";

export default function AreaChart() {
  const { calculatedAssets } = useCalculatedAssetStore();
  const { areaChartdata, setAreaChartData } = useAreaChartDataStore();

  useEffect(() => {
    setAreaChartData(convertToAreaChartData(calculatedAssets));
    // console.log(areaChartData);
  }, [calculatedAssets]);
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
      />
    </Card>
  );
}
