export type ActionAsset = {
  id: string;
  assetId: string;
  allocation: number;
  type: "%" | "fixed";
};

export type Action = {
  id: string;
  name: string;
  time: number;
  assetsIn: ActionAsset[];
  assetOut: ActionAsset | null;
  value: number;
  status: string;
};

export type Plan = {
  id: string;
  name: string;
  inflation: number;
  inflation_advanced: number[];
  inflation_mode: "simple" | "advanced";
  note: string;
  status: string;
  actions: Action[];
};
