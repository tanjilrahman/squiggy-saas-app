import { formatValue } from "@/lib/helperFunctions";
import { AreaChart as AC, Card, Subtitle, Title } from "@tremor/react";
import { Asset } from "../tables/assets/data/schema";
import { useEffect, useState } from "react";
import { useCalculatedAssetStore } from "@/store/calculationStore";

interface ChartData {
  year: number;
  "Total Asset Value": number;
  "Total Income": number;
  "Total Cost": number;
  "Asset YOY Increase": number;
}

function convertToChartData(calculatedAssets: Asset[][]): ChartData[] {
  return calculatedAssets[0]?.map((_, index) => {
    const year = 2023 + index; // Assuming the calculation starts from 2023

    const totalAssetValue = calculatedAssets
      .map((scenario) => scenario[index].value)
      .reduce((sum, value) => sum + value, 0);

    const totalIncome = calculatedAssets
      .map((scenario) => scenario[index].incomes[0]?.value)
      .reduce((sum, value) => sum + (value || 0), 0);

    const totalCost = calculatedAssets
      .map((scenario) => scenario[index].costs[0]?.value)
      .reduce((sum, value) => sum + (value || 0), 0);

    const assetYOYIncrease = calculatedAssets
      .map((scenario) => scenario[index].yoy_increase!)
      .reduce((sum, value) => sum + value, 0);

    return {
      year,
      "Total Asset Value": totalAssetValue,
      "Total Income": totalIncome,
      "Total Cost": totalCost,
      "Asset YOY Increase": assetYOYIncrease,
    };
  });
}

export default function AreaChart() {
  const { calculatedAssets } = useCalculatedAssetStore();
  const [areaChartData, setAreaChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    setAreaChartData(convertToChartData(calculatedAssets));
    // console.log(areaChartData);
  }, [calculatedAssets]);
  return (
    <Card>
      <Title>Prognosis</Title>
      <Subtitle>Some text to add</Subtitle>
      <AC
        yAxisWidth={40}
        showAnimation={true}
        data={areaChartData}
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
