import { BarChartData, AreaChartData } from "@/lib/helperFunctions";
import { create } from "zustand";

type BarChartDataStore = {
  barChartdata: BarChartData[];
  barChartKey: number;
  setBarChartKey: (key: number) => void;
  setBarChartData: (barChartdata: BarChartData[]) => void;
};

export const useBarChartDataStore = create<BarChartDataStore>((set) => ({
  barChartdata: [],
  barChartKey: 0,
  setBarChartKey: (barChartKey) => set({ barChartKey }),
  setBarChartData: (barChartdata) => set({ barChartdata }),
}));

type AreaChartDataStore = {
  areaChartdata: AreaChartData[];
  yearSelected: number | null;
  areaChartKey: number;
  setAreaChartKey: (key: number) => void;
  setYearSelected: (yearSelected: number | null) => void;
  setAreaChartData: (areaChartdata: AreaChartData[]) => void;
};

export const useAreaChartDataStore = create<AreaChartDataStore>((set) => ({
  areaChartdata: [],
  yearSelected: null,
  areaChartKey: 0,
  setAreaChartKey: (areaChartKey) => set({ areaChartKey }),
  setYearSelected: (yearSelected) => set({ yearSelected }),
  setAreaChartData: (areaChartdata) => set({ areaChartdata }),
}));
