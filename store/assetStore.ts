import { Asset } from "@/app/dashboard/tables/assets/data/schema";
import { create } from "zustand";

type AssetStore = {
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;

  updateAssetName: (assetId: string, newName: string) => void;
  updateAssetValue: (assetId: string, newValue: number) => void;
  updateAssetCategory: (assetId: string, newCategory: string) => void;
  updateAssetYoy: (assetId: string, newAssetYoy: number) => void;
  updateAssetNote: (assetId: string, newNote: string) => void;

  updateIncomeName: (
    assetId: string,
    incomeId: string,
    newName: string
  ) => void;
  updateIncomeValue: (
    assetId: string,
    incomeId: string,
    newValue: number
  ) => void;
  updateIncomeYoy: (
    assetId: string,
    incomeId: string,
    newIncomeYoy: number
  ) => void;
  updateIncomeType: (
    assetId: string,
    incomeId: string,
    newIncomeType: string
  ) => void;
  updateCostType: (
    assetId: string,
    costId: string,
    newCostType: string
  ) => void;

  updateCostYoy: (assetId: string, costId: string, newCostYoy: number) => void;

  updateCostName: (assetId: string, costId: string, newName: string) => void;

  updateCostValue: (
    assetId: string,
    incomeId: string,
    newValue: number
  ) => void;
};

// Define the Zustand store
export const useAssetStore = create<AssetStore>((set) => ({
  assets: [],

  setAssets: (assets) => set({ assets }),

  updateAssetName: (assetId, newName) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId ? { ...asset, name: newName } : asset
      ),
    }));
  },
  updateAssetValue: (assetId, newValue) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId ? { ...asset, value: newValue } : asset
      ),
    }));
  },
  updateAssetCategory: (assetId, newCategory) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId ? { ...asset, category: newCategory } : asset
      ),
    }));
  },
  updateAssetNote: (assetId, newNote) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId ? { ...asset, note: newNote } : asset
      ),
    }));
  },
  updateAssetYoy: (assetId, newAssetYoy) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId ? { ...asset, yoy: newAssetYoy } : asset
      ),
    }));
  },

  updateIncomeValue: (assetId, incomeId, newValue) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              incomes: asset.incomes.map((income) =>
                income.id === incomeId ? { ...income, value: newValue } : income
              ),
            }
          : asset
      ),
    }));
  },

  updateIncomeName: (assetId, incomeId, newName) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              incomes: asset.incomes.map((income) =>
                income.id === incomeId ? { ...income, name: newName } : income
              ),
            }
          : asset
      ),
    }));
  },

  updateIncomeYoy: (assetId, incomeId, newIncomeYoy) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              incomes: asset.incomes.map((income) =>
                income.id === incomeId
                  ? { ...income, yoy: newIncomeYoy }
                  : income
              ),
            }
          : asset
      ),
    }));
  },

  updateIncomeType: (assetId, incomeId, newIncomeType) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              incomes: asset.incomes.map((income) =>
                income.id === incomeId
                  ? { ...income, type: newIncomeType }
                  : income
              ),
            }
          : asset
      ),
    }));
  },

  updateCostName: (assetId, costId, newName) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              costs: asset.costs.map((cost) =>
                cost.id === costId ? { ...cost, name: newName } : cost
              ),
            }
          : asset
      ),
    }));
  },

  updateCostValue: (assetId, costId, newValue) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              costs: asset.costs.map((cost) =>
                cost.id === costId ? { ...cost, value: newValue } : cost
              ),
            }
          : asset
      ),
    }));
  },
  updateCostYoy: (assetId, costId, newCostYoy) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              costs: asset.costs.map((cost) =>
                cost.id === costId ? { ...cost, yoy: newCostYoy } : cost
              ),
            }
          : asset
      ),
    }));
  },
  updateCostType: (assetId, costId, newCostType) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              costs: asset.costs.map((cost) =>
                cost.id === costId ? { ...cost, type: newCostType } : cost
              ),
            }
          : asset
      ),
    }));
  },
  // ... add more functions for other properties as needed
}));
