import { create } from "zustand";

export type UserStateType = {
  currency: string;
  isPro: boolean;
};

interface navState {
  nav: string;
  setNav: (nav: string) => void;
}

export const useNavState = create<navState>()((set) => ({
  nav: "assets",
  setNav: (nav) => set({ nav }),
}));

interface horizonState {
  year: number;
  setYear: (year: number) => void;
}

export const useHorizonState = create<horizonState>()((set) => ({
  year: 5,
  setYear: (year) => set({ year }),
}));

interface UserState {
  user: UserStateType | null;
  setUser: (user: UserStateType) => void;
  updateCurrency: (currency: string) => void;
}

export const useUserState = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateCurrency: (currency) => {
    set((state) => ({
      ...state,
      currency,
    }));
  },
}));
