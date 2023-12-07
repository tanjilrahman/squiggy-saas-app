import { Asset } from "@/app/dashboard/tables/assets/data/schema";

export function calculateAsset(initialAsset: Asset, years: number): Asset[] {
  // 1st year Asset Calculation
  const calculatedIncomes = initialAsset.incomes.map((income) => {
    const incomeValue =
      income.value_mode === "fixed"
        ? income.value
        : (income.value / 100) * initialAsset.value;

    const yoyIncrease =
      income.yoy_mode === "simple"
        ? income.yoy_type === "fixed"
          ? income.yoy
          : (income.yoy / 100) * incomeValue
        : income.yoy_type === "fixed"
        ? income.yoy_advanced[0]
        : (income.yoy_advanced[0] / 100) * incomeValue;

    return { ...income, value: incomeValue, yoy_increase: yoyIncrease };
  });

  const calculatedCosts = initialAsset.costs.map((cost) => {
    const costValue =
      cost.value_mode === "fixed"
        ? cost.value
        : (cost.value / 100) * initialAsset.value;

    const yoyIncrease =
      cost.yoy_mode === "simple"
        ? cost.yoy_type === "fixed"
          ? cost.yoy
          : (cost.yoy / 100) * costValue
        : cost.yoy_type === "fixed"
        ? cost.yoy_advanced[0]
        : (cost.yoy_advanced[0] / 100) * costValue;

    return { ...cost, value: costValue, yoy_increase: yoyIncrease };
  });

  const calculateAssetProfit =
    calculatedIncomes.reduce((sum, income) => sum + income.value, 0) -
    calculatedCosts.reduce((sum, cost) => sum + cost.value, 0);

  const calculatedAssetYoy =
    initialAsset.yoy_mode === "simple"
      ? initialAsset.yoy_type === "fixed"
        ? initialAsset.yoy
        : (initialAsset.yoy / 100) * initialAsset.value
      : initialAsset.yoy_type === "fixed"
      ? initialAsset.yoy_advanced[0]
      : (initialAsset.yoy_advanced[0] / 100) * initialAsset.value;

  const calculatedAssetROI =
    (calculatedAssetYoy + calculateAssetProfit) / initialAsset.value;

  const calculatedInitialAsset: Asset = {
    id: initialAsset.id,
    category: initialAsset.category,
    name: initialAsset.name,
    note: initialAsset.note,
    value: initialAsset.value,
    yoy_advanced: initialAsset.yoy_advanced,
    yoy_mode: initialAsset.yoy_mode,
    yoy_type: initialAsset.yoy_type,
    yoy: initialAsset.yoy,
    allocation: initialAsset.allocation,
    additions: initialAsset.additions || 0,
    yoy_increase: calculatedAssetYoy,
    roi: calculatedAssetROI,
    profit: calculateAssetProfit,
    incomes: calculatedIncomes,
    costs: calculatedCosts,
  };

  // Next year Asset calculation
  const result: Asset[] = [calculatedInitialAsset];

  for (let year = 1; year < years; year++) {
    const prevAsset = result[year - 1];

    const newIncomes = prevAsset.incomes.map((income) => {
      const newIncomeValue = income.value + income.yoy_increase!;

      const yoyIncrease =
        income.yoy_mode === "simple"
          ? income.yoy_type === "fixed"
            ? income.yoy
            : (income.yoy / 100) * newIncomeValue
          : income.yoy_type === "fixed"
          ? income.yoy_advanced[year]
          : (income.yoy_advanced[year] / 100) * newIncomeValue;

      return { ...income, value: newIncomeValue, yoy_increase: yoyIncrease };
    });

    const newCosts = prevAsset.costs.map((cost) => {
      const newCostValue = cost.value + cost.yoy_increase!;

      const yoyIncrease =
        cost.yoy_mode === "simple"
          ? cost.yoy_type === "fixed"
            ? cost.yoy
            : (cost.yoy / 100) * newCostValue
          : cost.yoy_type === "fixed"
          ? cost.yoy_advanced[year]
          : (cost.yoy_advanced[year] / 100) * newCostValue;

      return { ...cost, value: newCostValue, yoy_increase: yoyIncrease };
    });

    const newAssetYoy =
      prevAsset.yoy_mode === "simple"
        ? prevAsset.yoy_type === "fixed"
          ? prevAsset.yoy
          : (prevAsset.yoy / 100) * prevAsset.value
        : prevAsset.yoy_type === "fixed"
        ? prevAsset.yoy_advanced[year]
        : (prevAsset.yoy_advanced[year] / 100) * prevAsset.value;

    const newAsset: Asset = {
      ...prevAsset,
      value: prevAsset.value + prevAsset.yoy_increase!,
      yoy_increase: newAssetYoy,
      profit:
        newIncomes.reduce((sum, income) => sum + income.value, 0) -
        newCosts.reduce((sum, cost) => sum + cost.value, 0),
      incomes: newIncomes,
      costs: newCosts,
    };

    result.push(newAsset);
  }

  return result;
}
