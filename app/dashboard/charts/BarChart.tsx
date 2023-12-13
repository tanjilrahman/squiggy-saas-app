import { Separator } from "@/components/ui/separator";
import { addProfitsToCurrency, calculateAsset } from "@/lib/calc";
import {
  BarChartData,
  convertToAreaChartData,
  convertToChartData,
  convertToStackedChartData,
  formatValue,
} from "@/lib/helperFunctions";
import { useAssetStore } from "@/store/assetStore";
import { useSelectedAssetStore } from "@/store/assetStore";
import { useCalculatedAssetStore } from "@/store/calculationStore";
import {
  useAreaChartDataStore,
  useBarChartDataStore,
  useStackedChartDataStore,
} from "@/store/chartStore";
import { useHorizonState } from "@/store/store";
import {
  BarChart as BC,
  Card,
  EventProps,
  Subtitle,
  Title,
} from "@tremor/react";
import { useEffect } from "react";

type PayloadDataType = {
  value: number;
  payload: BarChartData;
};

type EventPropsWithChartData = EventProps & BarChartData;

export default function BarChart() {
  const { assets } = useAssetStore();
  const { year } = useHorizonState();
  const { activePlans, setActivePlans, barChartActive, setBarChartActive } =
    useCalculatedAssetStore();
  const { selectedAssets } = useSelectedAssetStore();
  const { barChartdata, setBarChartData } = useBarChartDataStore();
  const { setStackedChartData } = useStackedChartDataStore();
  const { setAreaChartData } = useAreaChartDataStore();

  useEffect(() => {
    const filteredAssetsWithCategory = assets.filter((asset) => asset.category);
    if (selectedAssets.length == 0) {
      setBarChartData(convertToChartData(filteredAssetsWithCategory));
    } else {
      setBarChartData(convertToChartData(selectedAssets));
    }
  }, [assets, selectedAssets]);

  const onValueChange = (value: EventPropsWithChartData) => {
    const normalAssets = assets.filter((asset) => asset.category);
    const category = value?.category?.toLowerCase();
    if (category) {
      setBarChartActive(true);
    } else {
      setBarChartActive(false);
    }
    setActivePlans(false);

    const filteredAssetsWithCategory = assets.filter(
      (asset) => asset.category === category
    );

    const calculatedAssets = () => {
      const filteredPureAsset = assets.filter(
        (asset) =>
          !asset.action_asset && (category ? asset.category === category : true)
      );
      return filteredPureAsset.map((asset) => calculateAsset(asset, year));
    };

    const calculateAssetsWithAllocation = addProfitsToCurrency(
      calculatedAssets()
    );

    setStackedChartData(
      convertToStackedChartData(
        category ? filteredAssetsWithCategory : normalAssets
      )
    );
    setAreaChartData(convertToAreaChartData(calculateAssetsWithAllocation));
  };

  const customTooltip = ({
    payload,
    active,
  }: {
    payload: PayloadDataType[];
    active: boolean;
  }) => {
    if (!active || !payload) return null;
    let totalValue = payload[0]?.value;

    const categoryItems = assets.filter(
      (asset) => payload[0]?.payload.category.toLowerCase() === asset.category
    );

    return (
      <div className="w-56 rounded-tremor-default text-tremor-default bg-tremor-background dark:bg-dark-tremor-background-muted p-3 shadow-tremor-dropdown border border-tremor-border dark:border dark:border-dark-tremor-border">
        {categoryItems.map((item, idx) => (
          <div key={idx}>
            <div className="grid grid-cols-4">
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
            <Separator className="my-1" />
          </div>
        ))}
        <div className="grid grid-cols-4">
          <p className="text-tremor-content dark:text-dark-tremor-content-emphasis font-semibold col-span-2 flex items-center">
            <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1" />
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
    <Card className="z-10">
      <Title>Assets</Title>
      <Subtitle>Some text to add</Subtitle>
      <BC
        className="mt-6"
        data={barChartdata}
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
        customTooltip={customTooltip}
      />
    </Card>
  );
}
