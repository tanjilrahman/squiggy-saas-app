import { Asset } from "@/app/dashboard/tables/assets/data/schema";
import { create } from "zustand";

type CalculatedAssetStore = {
  calculatedAssets: Asset[][];
  setCalculatedAssets: (calculatedAssets: Asset[][]) => void;
};

export const useCalculatedAssetStore = create<CalculatedAssetStore>((set) => ({
  calculatedAssets: [],
  setCalculatedAssets: (calculatedAssets) => set({ calculatedAssets }),
}));
