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
  setYear: (nav: number) => void;
}

export const useHorizonState = create<horizonState>()((set) => ({
  year: 5,
  setYear: (year: number) => set({ year }),
}));
