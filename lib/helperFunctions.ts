import { Asset } from "@/app/dashboard/tables/assets/data/schema";

export interface ChartData {
  category: string;
  ["Total value"]: number;
}

export const convertToChartData = (data: Asset[]): ChartData[] => {
  const categoryTotals: { [key: string]: number } = {};

  data.forEach((asset) => {
    const category = asset?.category?.toLowerCase();

    if (!categoryTotals[category]) {
      categoryTotals[category] = asset.value;
    } else {
      categoryTotals[category] += asset.value ? asset.value : 0;
    }
  });

  const chartData: ChartData[] = Object.entries(categoryTotals).map(
    ([category, totalValue]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      ["Total value"]: totalValue,
    })
  );

  return chartData;
};

export const formatValue = (value: number): string => {
  const absValue = Math.abs(value);

  if (absValue >= 1e6) {
    return (value / 1e6).toFixed(1) + "M";
  } else if (absValue >= 1e3) {
    return Math.floor(+(value / 1e3).toFixed(1)) + "K";
  } else {
    return value.toString();
  }
};

export const formatValue2nd = (number: number) =>
  `$${new Intl.NumberFormat("us").format(number).toString()} USD`;
