export type IncomeCost = {
  id: string;
  name?: string;
  value: number;
  value_mode: "fixed" | "%";
  yoy_increase?: number;
  yoy: number;
  yoy_advanced: number[];
  yoy_type: "fixed" | "%";
  yoy_mode: "simple" | "advanced";
  type: string;
};

export type Asset = {
  id: string;
  action_asset: boolean;
  name: string;
  value: number;
  category: string;
  additions: number;
  allocation: string;
  yoy_increase?: number;
  yoy: number;
  yoy_advanced: number[];
  yoy_type: "fixed" | "%";
  yoy_mode: "simple" | "advanced";
  profit?: number;
  roi?: number;
  note: string | null;
  incomes: IncomeCost[];
  costs: IncomeCost[];
};
