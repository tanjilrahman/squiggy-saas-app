import { Asset } from "@/app/dashboard/tables/assets/data/schema";
import { Plan } from "@/app/dashboard/tables/plans/data/schema";

export function calculateAsset(
  initialAsset: Asset,
  years: number,
  plans?: Plan[],
  assets?: Asset[]
): Asset[] {
  // 1st year Asset Calculation
  const calculatedIncomes = initialAsset.incomes.map((income) => {
    const incomeValue =
      income.value_mode === "fixed"
        ? income.value
        : (income.value / 100) * initialAsset.value;

    const yoyIncrease =
      income.yoy_mode === "simple"
        ? income.yoy_type === "fixed"
          ? income.yoy || 0
          : ((income.yoy || 0) / 100) * incomeValue
        : income.yoy_type === "fixed"
        ? income.yoy_advanced[0] || 0
        : ((income.yoy_advanced[0] || 0) / 100) * incomeValue;

    return {
      ...income,
      value: incomeValue,
      yoy_increase: yoyIncrease,
    };
  });

  const calculatedCosts = initialAsset.costs.map((cost) => {
    const costValue =
      cost.value_mode === "fixed"
        ? cost.value
        : (cost.value / 100) * initialAsset.value;

    const yoyIncrease =
      cost.yoy_mode === "simple"
        ? cost.yoy_type === "fixed"
          ? cost.yoy || 0
          : ((cost.yoy || 0) / 100) * costValue
        : cost.yoy_type === "fixed"
        ? cost.yoy_advanced[0] || 0
        : ((cost.yoy_advanced[0] || 0) / 100) * costValue;

    return {
      ...cost,
      value: costValue,
      yoy_increase: yoyIncrease,
    };
  });

  const calculateAssetProfit =
    calculatedIncomes.reduce((sum, income) => sum + income.value, 0) -
    calculatedCosts.reduce((sum, cost) => sum + cost.value, 0);

  const calculatedAssetYoy =
    initialAsset.yoy_mode === "simple"
      ? initialAsset.yoy_type === "fixed"
        ? initialAsset.yoy || 0
        : ((initialAsset.yoy || 0) / 100) * initialAsset.value
      : initialAsset.yoy_type === "fixed"
      ? initialAsset.yoy_advanced[0] || 0
      : ((initialAsset.yoy_advanced[0] || 0) / 100) * initialAsset.value;

  const calculatedAssetROI =
    (((calculatedAssetYoy || 0) + calculateAssetProfit) / initialAsset.value) *
    100;

  const calculatedInitialAsset: Asset = {
    id: initialAsset.id,
    action_asset: initialAsset.action_asset,
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
  let result: Asset[] = [calculatedInitialAsset];

  for (let year = 1; year < years; year++) {
    const prevAsset = result[year - 1];

    const newIncomes = prevAsset.incomes.map((income) => {
      const initialIncome = initialAsset.incomes.find(
        (intialIncome) => intialIncome.id === income.id
      );
      const currentAssetValue = prevAsset.value + prevAsset.yoy_increase!;

      const newIncomeValue =
        income.value_mode === "fixed"
          ? income.value + income.yoy_increase!
          : (initialIncome!.value / 100) * currentAssetValue +
            income.yoy_increase!;

      const yoyIncrease =
        income.yoy_mode === "simple"
          ? income.yoy_type === "fixed"
            ? income.yoy || 0
            : ((income.yoy || 0) / 100) * newIncomeValue
          : income.yoy_type === "fixed"
          ? income.yoy_advanced[year] || 0
          : ((income.yoy_advanced[year] || 0) / 100) * newIncomeValue;

      return {
        ...income,
        value: newIncomeValue,
        yoy_increase: yoyIncrease,
      };
    });

    const newCosts = prevAsset.costs.map((cost) => {
      const initialCost = initialAsset.costs.find(
        (intialCost) => intialCost.id === cost.id
      );
      const currentAssetValue = prevAsset.value + prevAsset.yoy_increase!;

      const newCostValue =
        cost.value_mode === "fixed"
          ? cost.value + cost.yoy_increase!
          : (initialCost!.value / 100) * currentAssetValue + cost.yoy_increase!;

      const yoyIncrease =
        cost.yoy_mode === "simple"
          ? cost.yoy_type === "fixed"
            ? cost.yoy || 0
            : ((cost.yoy || 0) / 100) * newCostValue
          : cost.yoy_type === "fixed"
          ? cost.yoy_advanced[year] || 0
          : ((cost.yoy_advanced[year] || 0) / 100) * newCostValue;

      return {
        ...cost,
        value: newCostValue,
        yoy_increase: yoyIncrease,
      };
    });

    const newAssetYoy =
      prevAsset.yoy_mode === "simple"
        ? prevAsset.yoy_type === "fixed"
          ? prevAsset.yoy || 0
          : ((prevAsset.yoy || 0) / 100) * prevAsset.value
        : prevAsset.yoy_type === "fixed"
        ? prevAsset.yoy_advanced[year] || 0
        : ((prevAsset.yoy_advanced[year] || 0) / 100) * prevAsset.value;

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

  if (plans && assets) {
    const findActionAssetIn = (assetId: string) => {
      return plans
        ?.map((plan) =>
          plan.actions.filter((action) => action.assetsIn.includes(assetId))
        )
        .flat()[0];
    };

    const findActionAssetOut = (assetId: string) => {
      return plans
        ?.map((plan) =>
          plan.actions.filter((action) => action.assetOut === assetId)
        )
        .flat()[0];
    };

    const actionAsset = assets.find(
      (asset) =>
        initialAsset.id === asset.action_asset &&
        asset.id !== asset.action_asset
    );

    if (actionAsset) {
      const action =
        findActionAssetIn(actionAsset.id) || findActionAssetOut(actionAsset.id);
      result = result.map((asset, year) => {
        const emptyAsset = {
          ...asset,
          value: 0,
          additions: 0,
          yoy: 0,
          yoy_increase: 0,
          incomes: [],
          costs: [],
        };
        return year >= action?.time ? emptyAsset : asset;
      });
    }

    if (initialAsset.action_asset) {
      const action =
        findActionAssetIn(initialAsset.id) ||
        findActionAssetOut(initialAsset.id);
      result = result.map((asset, year) => {
        const emptyAsset = {
          ...asset,
          value: 0,
          additions: 0,
          yoy: 0,
          yoy_increase: 0,
          incomes: [],
          costs: [],
        };
        return year >= action?.time ? asset : emptyAsset;
      });
    }
  }

  return result;
}

export function addProfitsToCurrency(allAssets: Asset[][]): Asset[][] {
  return allAssets.map((scenario, targetAsset) => {
    return scenario.map((asset, targetYear) => {
      if (asset.category === "currency" && !asset.action_asset) {
        const allocatedAssets = allAssets.flat().filter(
          (otherAsset, index) =>
            index % scenario.length === targetYear &&
            // otherAsset.id !== asset.id &&
            otherAsset.allocation === asset.id
        );

        const totalProfit = allocatedAssets.reduce(
          (sum, otherAsset) => (sum += otherAsset.profit || 0),
          0
        );

        // Calculate new incomes for the "currency" asset
        const newIncomes = asset.incomes.map((income) => {
          const initialIncome = scenario[0].incomes.find(
            (intialIncome) => intialIncome.id === income.id
          );

          const initialIncomeValue = initialIncome!.value / scenario[0].value;

          const newIncomeValue =
            income.value_mode === "fixed"
              ? income.value
              : initialIncomeValue * asset.value;

          const yoyIncrease =
            income.yoy_mode === "simple"
              ? income.yoy_type === "fixed"
                ? income.yoy || 0
                : ((income.yoy || 0) / 100) * newIncomeValue
              : income.yoy_type === "fixed"
              ? income.yoy_advanced[targetYear] || 0
              : ((income.yoy_advanced[targetYear] || 0) / 100) * newIncomeValue;

          return {
            ...income,
            value: newIncomeValue + yoyIncrease,
            yoy_increase: yoyIncrease,
          };
        });

        // Calculate new costs for the "currency" asset
        const newCosts = asset.costs.map((cost) => {
          const initialCost = scenario[0].costs.find(
            (intialCost) => intialCost.id === cost.id
          );

          const initialCostValue = initialCost!.value / scenario[0].value;

          const newCostValue =
            cost.value_mode === "fixed"
              ? cost.value
              : (initialCostValue / 100) * asset.value;

          const yoyIncrease =
            cost.yoy_mode === "simple"
              ? cost.yoy_type === "fixed"
                ? cost.yoy || 0
                : ((cost.yoy || 0) / 100) * newCostValue
              : cost.yoy_type === "fixed"
              ? cost.yoy_advanced[targetYear] || 0
              : ((cost.yoy_advanced[targetYear] || 0) / 100) * newCostValue;

          return {
            ...cost,
            value: newCostValue + yoyIncrease,
            yoy_increase: yoyIncrease,
          };
        });

        // Update the asset with new values for incomes and costs
        const updatedAsset: Asset = {
          ...asset,
          additions: asset.additions + totalProfit,
          incomes: newIncomes,
          costs: newCosts,
        };

        // Update the next year asset value if applicable
        if (targetYear < scenario.length - 1) {
          const nextYearAsset = allAssets[targetAsset][targetYear + 1];
          nextYearAsset.value = asset.value + totalProfit;
        }

        return updatedAsset;
      }

      return asset;
    });
  });
}
