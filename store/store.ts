import { Asset, IncomeCost } from "@/app/dashboard/tables/assets/data/schema";
import { create } from "zustand";

interface navState {
  nav: string;
  setNav: (nav: string) => void;
}

export const useNavState = create<navState>()((set) => ({
  nav: "assets",
  setNav: (nav: string) => set({ nav }),
}));

type AssetStore = {
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
};

export const useAssetStore = create<AssetStore>((set) => ({
  assets: [],
  setAssets: (assets) => set({ assets }),
}));
