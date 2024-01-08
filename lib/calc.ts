import { Asset } from "@/app/dashboard/tables/assets/data/schema";
import { ActionAsset, Plan } from "@/app/dashboard/tables/plans/data/schema";

export function calculateAsset(
  initialAsset: Asset,
  years: number,
  plans?: Plan[] | null,
  activePlan?: Plan | null,
  activeInflation?: boolean | null
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

    let inflation = 1;
    let rescaleFactor = 1;

    if (plans) {
      rescaleFactor = getRescaleFactor(
        plans,
        initialAsset,
        year,
        prevAsset.value + prevAsset.yoy_increase!
      );
    }

    if (activeInflation && activePlan) {
      // let count = 0;

      // activePlan.actions.forEach((action) => {
      //   action.assetsIn.forEach((assetIn) => {
      //     if (assetIn.assetId === initialAsset.id) {
      //       count++;
      //     }
      //   });
      //   if (action.assetOut?.assetId === initialAsset.id) {
      //     count++;
      //   }
      // });

      const inflationYear = year + (initialAsset.action_asset || 0);

      const lastInflation =
        activePlan.inflation_advanced[activePlan.inflation_advanced.length - 1];

      // if (count > 0) {
      inflation =
        activePlan.inflation_mode === "simple"
          ? 1 + (activePlan.inflation || 0) / 100
          : 1 +
            (activePlan.inflation_advanced[inflationYear - 1] ||
              lastInflation) /
              100;
      // }
    }

    const newIncomes = prevAsset.incomes.map((income) => {
      const initialIncome = initialAsset.incomes.find(
        (intialIncome) => intialIncome.id === income.id
      );
      const currentAssetValue = prevAsset.value + prevAsset.yoy_increase!;

      const newIncomeValue =
        income.value_mode === "fixed"
          ? (income.value + income.yoy_increase!) * rescaleFactor
          : (initialIncome!.value / 100) * currentAssetValue +
            income.yoy_increase!;

      const lastIncomeYoy =
        income.yoy_advanced[income.yoy_advanced.length - 1] || 0;

      const yoyIncrease =
        income.yoy_mode === "simple"
          ? income.yoy_type === "fixed"
            ? (income.yoy || 0) * rescaleFactor
            : ((income.yoy || 0) / 100) * newIncomeValue
          : income.yoy_type === "fixed"
          ? (income.yoy_advanced[year] || 0) * rescaleFactor
          : ((income.yoy_advanced[year] || lastIncomeYoy) / 100) *
            newIncomeValue;

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
          ? (cost.value + cost.yoy_increase!) * rescaleFactor
          : (initialCost!.value / 100) * currentAssetValue + cost.yoy_increase!;

      const lastCostYoy = cost.yoy_advanced[cost.yoy_advanced.length - 1] || 0;

      const yoyIncrease =
        cost.yoy_mode === "simple"
          ? cost.yoy_type === "fixed"
            ? (cost.yoy || 0) * rescaleFactor
            : ((cost.yoy || 0) / 100) * newCostValue
          : cost.yoy_type === "fixed"
          ? (cost.yoy_advanced[year] || 0) * rescaleFactor
          : ((cost.yoy_advanced[year] || lastCostYoy) / 100) * newCostValue;

      return {
        ...cost,
        value: newCostValue,
        yoy_increase: yoyIncrease,
      };
    });

    const newAssetValue =
      (prevAsset.value + prevAsset.yoy_increase!) * rescaleFactor;

    const lastYoy =
      prevAsset.yoy_advanced[prevAsset.yoy_advanced.length - 1] || 0;

    const newAssetYoy =
      prevAsset.yoy_mode === "simple"
        ? prevAsset.yoy_type === "fixed"
          ? (prevAsset.yoy || 0) * rescaleFactor
          : ((prevAsset.yoy || 0) / 100) * newAssetValue
        : prevAsset.yoy_type === "fixed"
        ? (prevAsset.yoy_advanced[year] || 0) * rescaleFactor
        : ((prevAsset.yoy_advanced[year] || lastYoy) / 100) * newAssetValue;

    const newProfit =
      newIncomes.reduce((sum, income) => sum + income.value, 0) -
      newCosts.reduce((sum, cost) => sum + cost.value, 0);

    const newAsset: Asset = {
      ...prevAsset,
      value: newAssetValue / inflation,
      yoy_increase: newAssetYoy / inflation,
      profit: newProfit,
      incomes: newIncomes,
      costs: newCosts,
    };

    result.push(newAsset);
  }

  if (initialAsset.action_asset) {
    const emptyAssetArray = Array.from(
      { length: initialAsset.action_asset },
      () => ({
        id: initialAsset.id,
        action_asset: initialAsset.action_asset,
        name: initialAsset.name,
        value: 0,
        category: initialAsset.category,
        note: initialAsset.note,
        additions: 0,
        allocation: initialAsset.allocation,
        yoy: 0,
        yoy_advanced: [],
        yoy_type: initialAsset.yoy_type,
        yoy_mode: initialAsset.yoy_mode,
        profit: 0,
        roi: 0,
        incomes: [],
        costs: [],
      })
    );

    // Add elements at the beginning
    result.unshift(...emptyAssetArray);

    // Remove the same number of elements from the end
    result.splice(-initialAsset.action_asset);
  }
  return result;
}

export function addProfitsToCurrency(
  allAssets: Asset[][],
  altAssets?: Asset[][] | null,
  plans?: Plan[] | null,
  activePlan?: Plan | null,
  activeInflation?: boolean | null
): Asset[][] {
  return allAssets.map((scenario, targetAsset) => {
    return scenario.map((asset, targetYear) => {
      if (asset.category === "currency") {
        const targetAllAssets = altAssets ? altAssets : allAssets;

        const allocatedAssets = targetAllAssets
          .flat()
          .filter(
            (otherAsset, index) =>
              index % scenario.length === targetYear &&
              otherAsset.id !== asset.id &&
              otherAsset.allocation === asset.id
          );

        const totalProfit = allocatedAssets.reduce(
          (sum, otherAsset) => (sum += otherAsset.profit || 0),
          0
        );

        const assetIndex = asset.action_asset || 0;

        const initialAsset = targetAllAssets.find(
          (assets) => assets[assetIndex].id === asset.id
        );

        let inflation = 1;
        let rescaleFactor = 1;

        if (activeInflation && activePlan) {
          // let count = 0;

          // activePlan.actions.forEach((action) => {
          //   action.assetsIn.forEach((assetIn) => {
          //     if (assetIn.assetId === asset.id) {
          //       count++;
          //     }
          //   });
          //   if (action.assetOut?.assetId === asset.id) {
          //     count++;
          //   }
          // });

          const inflationYear = targetYear + (asset.action_asset || 0);
          const lastInflation =
            activePlan.inflation_advanced[
              activePlan.inflation_advanced.length - 1
            ];
          // if (count > 0) {
          inflation =
            activePlan.inflation_mode === "simple"
              ? 1 + (activePlan.inflation || 0) / 100
              : 1 +
                (activePlan.inflation_advanced[inflationYear] ||
                  lastInflation) /
                  100;
          // }
        }

        // Calculate new incomes for the "currency" asset
        const newIncomes = asset.incomes.map((income) => {
          const initialIncome = initialAsset![assetIndex].incomes.find(
            (intialIncome) => intialIncome.id === income.id
          );

          const initialIncomeValue =
            initialIncome!.value / initialAsset![assetIndex].value;

          const newIncomeValue =
            income.value_mode === "fixed"
              ? income.value * rescaleFactor
              : initialIncomeValue * asset.value;

          const lastIncomeYoy =
            income.yoy_advanced[income.yoy_advanced.length - 1] || 0;

          const yoyIncrease =
            income.yoy_mode === "simple"
              ? income.yoy_type === "fixed"
                ? (income.yoy || 0) * rescaleFactor
                : ((income.yoy || 0) / 100) * newIncomeValue
              : income.yoy_type === "fixed"
              ? (income.yoy_advanced[targetYear] || 0) * rescaleFactor
              : ((income.yoy_advanced[targetYear] || lastIncomeYoy) / 100) *
                newIncomeValue;

          const newValue = newIncomeValue + yoyIncrease;

          return {
            ...income,
            value: newValue,
            yoy_increase: yoyIncrease,
          };
        });

        // Calculate new costs for the "currency" asset
        const newCosts = asset.costs.map((cost) => {
          const initialCost = initialAsset![assetIndex].costs.find(
            (intialCost) => intialCost.id === cost.id
          );

          const initialCostValue =
            initialCost!.value / initialAsset![assetIndex].value;

          const newCostValue =
            cost.value_mode === "fixed"
              ? cost.value * rescaleFactor
              : (initialCostValue / 100) * asset.value;

          const lastCostYoy =
            cost.yoy_advanced[cost.yoy_advanced.length - 1] || 0;

          const yoyIncrease =
            cost.yoy_mode === "simple"
              ? cost.yoy_type === "fixed"
                ? (cost.yoy || 0) * rescaleFactor
                : ((cost.yoy || 0) / 100) * newCostValue
              : cost.yoy_type === "fixed"
              ? (cost.yoy_advanced[targetYear] || 0) * rescaleFactor
              : ((cost.yoy_advanced[targetYear] || lastCostYoy) / 100) *
                newCostValue;

          const newValue = newCostValue + yoyIncrease;

          return {
            ...cost,
            value: newValue,
            yoy_increase: yoyIncrease,
          };
        });

        const newTotalProfit =
          newIncomes.reduce((sum, income) => sum + income.value, 0) -
          newCosts.reduce((sum, cost) => sum + cost.value, 0);

        // Update the asset with new values for incomes and costs
        const updatedAsset: Asset = {
          ...asset,
          yoy_increase: (asset.yoy_increase || 0) / inflation,
          additions: asset.additions + totalProfit + newTotalProfit,
          incomes: newIncomes,
          costs: newCosts,
        };

        const nextYearAssetValue = updatedAsset.value + updatedAsset.additions;

        if (plans) {
          rescaleFactor = getRescaleFactor(
            activePlan ? [activePlan] : plans,
            initialAsset![assetIndex],
            targetYear + 1,
            nextYearAssetValue
          );
        }

        // Update the next year asset value if applicable
        if (targetYear < scenario.length - 1) {
          const nextYearAsset = allAssets[targetAsset][targetYear + 1];
          const newValueRescaled = nextYearAssetValue * rescaleFactor;
          nextYearAsset.value = newValueRescaled / inflation;
        }

        return updatedAsset;
      }

      return asset;
    });
  });
}

type TypeModifiedActionAsset = ActionAsset & {
  action_type: "asset_in" | "asset_out";
};

const getRescaleFactor = (
  plans: Plan[],
  initialAsset: Asset,
  targetYear: number,
  assetValue: number
) => {
  let rescaleFactor = 1;
  let modifiedActionAssets: TypeModifiedActionAsset[] = [];

  plans?.forEach((plan) =>
    plan.actions.forEach((action) => {
      if (action.time === targetYear) {
        action.assetsIn.forEach((assetIn) => {
          if (assetIn.assetId === initialAsset.id) {
            modifiedActionAssets.push({
              ...assetIn,
              action_type: "asset_in",
            });
          }
        });
        if (action.assetOut?.assetId === initialAsset.id) {
          modifiedActionAssets.push({
            ...action.assetOut,
            action_type: "asset_out",
          });
        }
      }
    })
  );

  if (modifiedActionAssets.length > 0) {
    let tempscale = 0;
    modifiedActionAssets.forEach((asset) => {
      const rescale =
        asset.type === "%"
          ? asset.allocation / 100
          : asset.allocation / assetValue;

      if (asset.action_type === "asset_in") {
        tempscale += 1 - rescale;
      } else if (asset.action_type === "asset_out") {
        tempscale += 1 + rescale;
      }
    });

    rescaleFactor = tempscale;
  }
  return rescaleFactor;
};
