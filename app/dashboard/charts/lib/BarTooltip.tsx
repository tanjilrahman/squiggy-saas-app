import { Separator } from "@/components/ui/separator";
import { BarChartData, formatValue } from "@/lib/helperFunctions";
import { useAssetStore, useSelectedAssetStore } from "@/store/assetStore";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import { Asset } from "../../tables/assets/data/schema";

type PayloadDataType = {
  value: number;
  payload: BarChartData;
};

export const BarTooltip = ({
  payload,
  active,
}: {
  payload: PayloadDataType[];
  active: boolean;
}) => {
  const { activePlans, singleYearCalculatedAsset } = useCalculatedAssetStore();
  const { selectedAssets } = useSelectedAssetStore();

  if (!active || !payload) return null;
  let totalValue = payload[0]?.value;

  function getTypeValues(assetsToConvert: Asset[]) {
    const pureAssets = assetsToConvert.filter((asset) => !asset.action_asset);
    const filteredAssets =
      selectedAssets.length == 0
        ? activePlans
          ? assetsToConvert
          : pureAssets
        : selectedAssets;

    return filteredAssets.filter(
      (asset) => payload[0]?.payload.category.toLowerCase() === asset.category
    );
  }

  return (
    <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background dark:bg-dark-tremor-background-muted shadow-tremor-dropdown border border-tremor-border dark:border dark:border-dark-tremor-border">
      <div className="grid grid-cols-4 py-2 px-3">
        <div className="flex items-center space-x-1 col-span-3">
          <span className="w-2 h-2 rounded-full bg-indigo-500" />
          <p className=" text-tremor-content dark:text-dark-tremor-background-emphasis font-semibold">
            {payload[0]?.payload.category}
          </p>
        </div>

        <p className="font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis ml-auto">
          {formatValue(totalValue)}
        </p>
      </div>
      <Separator />
      <div className="py-2 space-y-1">
        {getTypeValues(singleYearCalculatedAsset).map((item, idx) => (
          <div key={idx} className="grid grid-cols-4 px-3">
            <p className="text-tremor-content dark:text-dark-tremor-content col-span-2">
              {item.name}
            </p>
            <p className="font-medium text-tremor-content-emphasis dark:text-dark-tremor-content-emphasis ml-auto">
              {formatValue(item.value)}
            </p>
            <p className="font-medium text-tremor-content dark:text-dark-tremor-content ml-2">
              ({Math.floor((item.value / totalValue) * 100)}%)
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
