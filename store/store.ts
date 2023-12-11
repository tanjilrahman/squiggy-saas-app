import { create } from "zustand";

interface navState {
  nav: string;
  setNav: (nav: string) => void;
}

export const useNavState = create<navState>()((set) => ({
  nav: "assets",
  setNav: (nav: string) => set({ nav }),
}));

interface horizonState {
  year: number;
  setYear: (year: number) => void;
}

export const useHorizonState = create<horizonState>()((set) => ({
  year: 5,
  setYear: (year: number) => set({ year }),
}));

interface showActionAssets {
  show: boolean;
  setShow: (show: boolean) => void;
}

export const useShowActionAssets = create<showActionAssets>()((set) => ({
  show: true,
  setShow: (show: boolean) => set({ show }),
}));
