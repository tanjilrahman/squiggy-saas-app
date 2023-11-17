import { Separator } from "@/components/ui/separator";
import {
  ChartData,
  convertToChartData,
  formatValue,
} from "@/lib/helperFunctions";
import { useAssetStore } from "@/store/assetStore";
import { useSelectedAssetStore } from "@/store/assetStore";
import {
  BarChart as BC,
  Card,
  Subtitle,
  Title,
  ValueFormatter,
} from "@tremor/react";
import { useEffect, useState } from "react";

type PayloadDataType = {
  value: number;
  payload: ChartData;
};

export default function BarChart() {
  const { assets } = useAssetStore();
  const { selectedAssets } = useSelectedAssetStore();
  const [chartdata, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (selectedAssets.length == 0) {
      setChartData(convertToChartData(assets));
    } else {
      setChartData(convertToChartData(selectedAssets));
    }
  }, [assets, selectedAssets]);

  const customTooltip = ({
    payload,
    active,
  }: {
    payload: PayloadDataType[];
    active: boolean;
  }) => {
    if (!active || !payload) return null;
    let totalValue = payload[0].value;

    const categoryItems = assets.filter(
      (asset) => payload[0].payload.category.toLowerCase() === asset.category
    );

    return (
      <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background dark:bg-dark-tremor-background-muted p-3 shadow-tremor-dropdown border border-tremor-border dark:border dark:border-dark-tremor-border">
        {categoryItems.map((item, idx) => (
          <>
            <div key={idx} className="grid grid-cols-4">
              <p className="text-tremor-content dark:text-dark-tremor-content col-span-2">
                {item.name}
              </p>
              <p className="font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis ml-auto">
                {formatValue(item.value)}
              </p>
              <p className="font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis ml-auto">
                ({Math.floor((item.value / totalValue) * 100)}%)
              </p>
            </div>
            <Separator className="my-1" />
          </>
        ))}
        <div className="grid grid-cols-4">
          <p className="text-tremor-content dark:text-dark-tremor-content col-span-2 flex items-center">
            <div className="w-2 h-2 rounded-full bg-indigo-500 mr-1" />
            Total
          </p>
          <p className="font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis ml-auto">
            {formatValue(totalValue)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <Title>Assets</Title>
      <Subtitle>
        The IUCN Red List has assessed only a small share of the total known
        species in the world.
      </Subtitle>
      <BC
        className=""
        data={chartdata}
        index="category"
        categories={["Total value"]}
        colors={["indigo"]}
        valueFormatter={formatValue}
        yAxisWidth={40}
        showAnimation={true}
        customTooltip={customTooltip}
      />
    </Card>
  );
}
