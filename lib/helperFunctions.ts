import { Asset, IncomeCost } from "@/app/dashboard/tables/assets/data/schema";

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

export interface ResultItem {
  index: string;
  [key: string]: string | number;
}

interface Totals {
  [key: string]: number;
}

export const convertToStackedChartData = (inputData: Asset[]): ResultItem[] => {
  // Initialize objects to store income, cost, and margin totals by category type
  const incomeTotals: Totals = {};
  const costTotals: Totals = {};

  const capitalizeFirstLetter = (input: string): string => {
    return input.charAt(0).toUpperCase() + input.slice(1);
  };

  // Iterate through the input data and sum values by category type
  inputData.forEach((asset) => {
    // Sum Incomes
    asset.incomes.forEach((income) => {
      const capitalizedType = capitalizeFirstLetter(income.type);
      if (!incomeTotals[capitalizedType]) {
        incomeTotals[capitalizedType] = 0;
      }
      incomeTotals[capitalizedType] += income.value;
    });

    // Sum Costs
    asset.costs.forEach((cost) => {
      const capitalizedType = capitalizeFirstLetter(cost.type);
      if (!costTotals[capitalizedType]) {
        costTotals[capitalizedType] = 0;
      }
      costTotals[capitalizedType] += cost.value;
    });
  });

  // Calculate Margin
  const margin =
    Object.values(incomeTotals).reduce((acc, income) => acc + income, 0) -
    Object.values(costTotals).reduce((acc, cost) => acc + cost, 0);
  // Organize the data into the desired format
  const result: ResultItem[] = [
    { index: "Incomes", ...incomeTotals },
    { index: "Costs", ...costTotals },
    { index: "Margin", Margin: margin },
  ];

  return result;
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
