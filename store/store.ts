import { create } from 'zustand';

interface navState {
    nav: string
    setNav: (nav: string) => void
}

export const useNavState = create<navState>()((set) => ({
    nav: 'assets',
    setNav: (nav: string) => set({ nav })
}))