import {
  BarChartData,
  StackedChartData,
  AreaChartData,
} from "@/lib/helperFunctions";
import { create } from "zustand";

type BarChartDataStore = {
  barChartdata: BarChartData[];
  setBarChartData: (barChartdata: BarChartData[]) => void;
};

export const useBarChartDataStore = create<BarChartDataStore>((set) => ({
  barChartdata: [],
  setBarChartData: (barChartdata) => set({ barChartdata }),
}));

type StackedChartDataStore = {
  stackedChartdata: StackedChartData[];
  setStackedChartData: (stackedChartdata: StackedChartData[]) => void;
};

export const useStackedChartDataStore = create<StackedChartDataStore>(
  (set) => ({
    stackedChartdata: [],
    setStackedChartData: (stackedChartdata) => set({ stackedChartdata }),
  })
);

type AreaChartDataStore = {
  areaChartdata: AreaChartData[];
  setAreaChartData: (areaChartdata: AreaChartData[]) => void;
};

export const useAreaChartDataStore = create<AreaChartDataStore>((set) => ({
  areaChartdata: [],
  setAreaChartData: (areaChartdata) => set({ areaChartdata }),
}));
