import { Separator } from "@/components/ui/separator";
import {
  ResultItem,
  convertToStackedChartData,
  formatValue,
} from "@/lib/helperFunctions";
import { useAssetStore, useSelectedAssetStore } from "@/store/assetStore";
import { Card, Title, BarChart, Subtitle } from "@tremor/react";
import { useEffect, useState } from "react";
import { Asset } from "../tables/assets/data/schema";

export default function StackedBarChart() {
  const { assets } = useAssetStore();
  const { selectedAssets } = useSelectedAssetStore();
  const [stackedChartData, setStackedChartData] = useState<ResultItem[]>([]);

  useEffect(() => {
    if (selectedAssets.length == 0) {
      setStackedChartData(convertToStackedChartData(assets));
    } else {
      setStackedChartData(convertToStackedChartData(selectedAssets));
    }
  }, [assets, selectedAssets]);

  type PayloadDataType = {
    value: number;
    className: string;
    dataKey: string;
    payload: ResultItem[];
  };

  const customTooltipFunction = ({
    payload,
    active,
  }: {
    payload: PayloadDataType[];
    active: boolean;
  }) => {
    if (!active || !payload) return null;

    interface TypeValues {
      assetName: string;
      typeValue: number;
    }

    function getTypeValues(targetType: string, assets: Asset[]): TypeValues[] {
      return assets.reduce((result, asset) => {
        // Function to adjust values based on the percentage mode
        const adjustValue = (
          value: number,
          value_mode: "fixed" | "%",
          assetValue: number
        ): number => {
          return value_mode === "%" ? (value / 100) * assetValue : value;
        };

        const matchingIncomes = asset.incomes.filter(
          (income) => income.type === targetType.toLocaleLowerCase()
        );
        const matchingCosts = asset.costs.filter(
          (cost) => cost.type === targetType.toLocaleLowerCase()
        );

        if (matchingIncomes.length > 0) {
          const totalIncomeValue = matchingIncomes.reduce(
            (sum, income) =>
              sum + adjustValue(income.value, income.value_mode, asset.value),
            0
          );
          result.push({
            assetName: asset.name,
            typeValue: totalIncomeValue,
          });
        }

        if (matchingCosts.length > 0) {
          const totalCostValue = matchingCosts.reduce(
            (sum, cost) =>
              sum + adjustValue(cost.value, cost.value_mode, asset.value),
            0
          );
          result.push({
            assetName: asset.name,
            typeValue: totalCostValue,
          });
        }

        return result;
      }, [] as TypeValues[]);
    }

    return (
      <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background dark:bg-dark-tremor-background-muted shadow-tremor-dropdown border border-tremor-border dark:border dark:border-dark-tremor-border">
        {payload.map((item, idx) => (
          <div key={idx}>
            <div>
              <div className="grid grid-cols-4 py-2 px-3">
                <div className="flex items-center space-x-1 col-span-3">
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 8 8"
                    className={item.className}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="4" cy="4" r="4" />
                  </svg>
                  <p className=" text-tremor-content dark:text-dark-tremor-background-emphasis font-semibold">
                    {item.dataKey}
                  </p>
                </div>

                <p className="font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis ml-auto">
                  {formatValue(item.value)}
                </p>
              </div>

              {payload.length > 1 && <Separator className="" />}

              <div className="pt-[2px] pb-2">
                {getTypeValues(item.dataKey, assets).map((asset, i) => (
                  <div key={i} className="grid grid-cols-4 px-3 space-y-[2px]">
                    <p className="text-tremor-content dark:text-dark-tremor-content col-span-2">
                      {asset.assetName}
                    </p>
                    <p className="font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis ml-auto">
                      {formatValue(asset.typeValue)}
                    </p>
                    <p className="font-medium text-tremor-content dark:text-dark-tremor-content ml-auto">
                      ({Math.floor((asset.typeValue / item.value) * 100)}%)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="z-10">
      <Title>Margin</Title>
      <Subtitle>Some text to add</Subtitle>
      <BarChart
        className="mt-4 h-80"
        data={stackedChartData}
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
        // showYAxis={false}
        // showGridLines={false}
        showAnimation={true}
        // @ts-ignore
        customTooltip={customTooltipFunction}
      />
    </Card>
  );
}
