import { Asset, IncomeCost } from "@/app/dashboard/tables/assets/data/schema";
import { create } from "zustand";

type AssetExpandedState = {
  expanded: string | null;
  isEditable: boolean;
  setExpanded: (id: string | null) => void;
  setIsEditable: (boolean: boolean) => void;
};

export const useAssetExpandedState = create<AssetExpandedState>((set) => ({
  expanded: null,
  isEditable: false,
  setExpanded: (id) => set({ expanded: id }),
  setIsEditable: (boolean) => set({ isEditable: boolean }),
}));

type SelectedAssetStore = {
  selectedAssets: Asset[];
  setSelectedAssets: (assets: Asset[]) => void;
};

// Define the Zustand store
export const useSelectedAssetStore = create<SelectedAssetStore>((set) => ({
  selectedAssets: [],
  setSelectedAssets: (selectedAssets) => set({ selectedAssets }),
}));

type AssetStore = {
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;

  addAsset: (newAsset: Asset) => void;
  addIncome: (assetId: string, newIncome: IncomeCost) => void;
  addCost: (assetId: string, newCost: IncomeCost) => void;

  removeAsset: (assetId: string) => void;
  removeIncome: (assetId: string, incomeId: string) => void;
  removeCost: (assetId: string, costId: string) => void;

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

  addAsset: (newAsset) => {
    set((state) => ({
      assets: [newAsset, ...state.assets],
    }));
  },

  addIncome: (assetId, newIncome) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              incomes: [...asset.incomes, newIncome],
            }
          : asset
      ),
    }));
  },

  addCost: (assetId, newCost) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              costs: [...asset.costs, newCost],
            }
          : asset
      ),
    }));
  },

  removeAsset: (assetId) => {
    set((state) => ({
      assets: state.assets.filter((asset) => asset.id !== assetId),
    }));
  },

  removeIncome: (assetId, incomeId) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              incomes: asset.incomes.filter((income) => income.id !== incomeId),
            }
          : asset
      ),
    }));
  },

  removeCost: (assetId, costId) => {
    set((state) => ({
      assets: state.assets.map((asset) =>
        asset.id === assetId
          ? {
              ...asset,
              costs: asset.costs.filter((cost) => cost.id !== costId),
            }
          : asset
      ),
    }));
  },

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
