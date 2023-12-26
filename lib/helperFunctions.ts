import { Asset } from "@/app/dashboard/tables/assets/data/schema";

export interface BarChartData {
  category: string;
  ["Total value"]: number;
}

export const convertToChartData = (data: Asset[]): BarChartData[] => {
  const categoryTotals: { [key: string]: number } = {};

  data.forEach((asset) => {
    const category = asset?.category?.toLowerCase();

    if (!categoryTotals[category]) {
      categoryTotals[category] = asset.value;
    } else {
      categoryTotals[category] += asset.value ? asset.value : 0;
    }
  });

  const chartData: BarChartData[] = Object.entries(categoryTotals).map(
    ([category, totalValue]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      ["Total value"]: totalValue,
    })
  );

  return chartData;
};

export interface StackedChartData {
  index: string;
  [key: string]: string | number;
}

interface Totals {
  [key: string]: number;
}

export const convertToStackedChartData = (
  inputData: Asset[],
  yearSelected: number | null
): StackedChartData[] => {
  const incomeTotals: Totals = {};
  const costTotals: Totals = {};

  const capitalizeFirstLetter = (input: string): string => {
    return input.charAt(0).toUpperCase() + input.slice(1);
  };

  inputData.forEach((asset) => {
    const adjustValue = (
      value: number,
      value_mode: "fixed" | "%",
      assetValue: number
    ): number => {
      return value_mode === "%" && !yearSelected
        ? (value / 100) * assetValue
        : value;
    };

    // Sum Incomes
    asset.incomes.forEach((income) => {
      const capitalizedType = capitalizeFirstLetter(income.type);
      if (!incomeTotals[capitalizedType]) {
        incomeTotals[capitalizedType] = 0;
      }
      incomeTotals[capitalizedType] += adjustValue(
        income.value,
        income.value_mode,
        asset.value
      );
    });

    // Sum Costs
    asset.costs.forEach((cost) => {
      const capitalizedType = capitalizeFirstLetter(cost.type);
      if (!costTotals[capitalizedType]) {
        costTotals[capitalizedType] = 0;
      }
      costTotals[capitalizedType] += adjustValue(
        cost.value,
        cost.value_mode,
        asset.value
      );
    });
  });

  // Calculate Margin
  const margin =
    Object.values(incomeTotals).reduce((acc, income) => acc + income, 0) -
    Object.values(costTotals).reduce((acc, cost) => acc + cost, 0);

  // Organize the data into the desired format
  const result: StackedChartData[] = [
    { index: "Incomes", ...incomeTotals },
    { index: "Costs", ...costTotals },
    { index: "Margin", Margin: margin },
  ];

  return result;
};

export interface AreaChartData {
  year: number;
  "Total Asset Value": number;
  "Total Revenue": number;
  "Total Expense": number;
  "YOY Increase": number;
}

export function convertToAreaChartData(
  calculatedAssets: Asset[][]
): AreaChartData[] {
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
      "Total Revenue": totalIncome,
      "Total Expense": totalCost,
      "YOY Increase": assetYOYIncrease,
    };
  });
}

export const formatValue = (value: number): string => {
  const absValue = Math.abs(value);

  if (absValue >= 1e6) {
    return (value / 1e6).toFixed(1) + "M";
  } else if (absValue >= 1e3) {
    return (value / 1e3) % 1 == 0
      ? value / 1e3 + "K"
      : (value / 1e3).toFixed(1) + "K";
  } else {
    return Math.floor(value).toString();
  }
};

export const formatNumericValue = (numericValue: number | null) => {
  return new Intl.NumberFormat("en-US").format(numericValue || 0);
};

export function calculateProfit(asset: Asset): number {
  const adjustValue = (
    value: number,
    value_mode: "fixed" | "%",
    assetValue: number
  ): number => {
    return value_mode === "%" ? (value / 100) * assetValue : value;
  };

  const totalIncome = asset.incomes.reduce(
    (sum, income) =>
      sum + adjustValue(income.value, income.value_mode, asset.value),
    0
  );

  const totalCost = asset.costs.reduce(
    (sum, cost) => sum + adjustValue(cost.value, cost.value_mode, asset.value),
    0
  );

  const netIncome = totalIncome - totalCost;
  return netIncome;
}

export function calculateROI(asset: Asset): number {
  const calculatedAssetYoy =
    asset.yoy_mode === "simple"
      ? asset.yoy_type === "fixed"
        ? asset.yoy || 0
        : ((asset.yoy || 0) / 100) * asset.value
      : asset.yoy_type === "fixed"
      ? asset.yoy_advanced[0] || 0
      : ((asset.yoy_advanced[0] || 0) / 100) * asset.value;

  const calculatedAssetROI =
    (((calculatedAssetYoy || 0) + calculateProfit(asset)) / asset.value) * 100;
  return calculatedAssetROI;
}
