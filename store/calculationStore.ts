import { Asset } from "@/app/dashboard/tables/assets/data/schema";
import { create } from "zustand";

type CalculatedAssetStore = {
  calculatedAssets: Asset[][];
  activePlans: boolean;
  setActivePlans: (activePlans: boolean) => void;
  setCalculatedAssets: (calculatedAssets: Asset[][]) => void;
};

export const useCalculatedAssetStore = create<CalculatedAssetStore>((set) => ({
  calculatedAssets: [],
  activePlans: true,
  setActivePlans: (activePlans) => set({ activePlans }),
  setCalculatedAssets: (calculatedAssets) => set({ calculatedAssets }),
}));
