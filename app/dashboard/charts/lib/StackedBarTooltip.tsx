import { StackedChartData, formatValue } from "@/lib/helperFunctions";
import { Separator } from "@/components/ui/separator";
import { useSelectedAssetStore } from "@/store/assetStore";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import { Asset } from "../../tables/assets/data/schema";
import { useAreaChartDataStore } from "@/store/chartStore";

type PayloadDataType = {
  value: number;
  className: string;
  dataKey: string;
  payload: StackedChartData[];
};

interface TypeValues {
  assetName: string;
  typeValue: number;
}

export const StackedBarTooltip = ({
  payload,
  active,
}: {
  payload: PayloadDataType[];
  active: boolean;
}) => {
  const { activePlans, singleYearCalculatedAsset } = useCalculatedAssetStore();
  const { yearSelected } = useAreaChartDataStore();
  const { selectedAssets } = useSelectedAssetStore();

  if (!active || !payload) return null;

  function getTypeValues(
    targetType: string,
    assetsToConvert: Asset[]
  ): TypeValues[] {
    const pureAssets = assetsToConvert.filter((asset) => !asset.action_asset);

    const filteredAssets =
      selectedAssets.length == 0
        ? activePlans
          ? assetsToConvert
          : pureAssets
        : selectedAssets;

    return filteredAssets.reduce((result, asset) => {
      // Function to adjust values based on the percentage mode
      const adjustValue = (
        value: number,
        value_mode: "fixed" | "%",
        assetValue: number
      ): number => {
        return value_mode === "%" && !yearSelected
          ? (value / 100) * assetValue
          : value;
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

          {payload.length > 1 && <Separator />}

          <div className="pt-1 pb-2 space-y-1">
            {getTypeValues(item.dataKey, singleYearCalculatedAsset).map(
              (asset, i) => (
                <div key={i} className="grid grid-cols-4 px-3">
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
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
