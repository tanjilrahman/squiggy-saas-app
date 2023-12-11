import { Asset } from "@/app/dashboard/tables/assets/data/schema";
import { create } from "zustand";

type CalculatedAssetStore = {
  calculatedAssets: Asset[][];
  activePlans: boolean;
  barChartActive: boolean;
  setBarChartActive: (barChartActive: boolean) => void;
  setActivePlans: (activePlans: boolean) => void;
  setCalculatedAssets: (calculatedAssets: Asset[][]) => void;
};

export const useCalculatedAssetStore = create<CalculatedAssetStore>((set) => ({
  calculatedAssets: [],
  activePlans: true,
  barChartActive: false,
  setBarChartActive: (barChartActive) => set({ barChartActive }),
  setActivePlans: (activePlans) => set({ activePlans }),
  setCalculatedAssets: (calculatedAssets) => set({ calculatedAssets }),
}));
