export type IncomeCost = {
  id: string;
  name?: string;
  value: number;
  value_mode: "fixed" | "%";
  yoy_increase?: number;
  yoy: number | null;
  yoy_advanced: (number | null)[];
  yoy_type: "fixed" | "%";
  yoy_mode: "simple" | "advanced";
  type: string;
};

export type Asset = {
  id: string;
  action_asset: string | null;
  name: string;
  value: number;
  category: string;
  additions: number;
  allocation: string;
  yoy_increase?: number;
  yoy: number | null;
  yoy_advanced: (number | null)[];
  yoy_type: "fixed" | "%";
  yoy_mode: "simple" | "advanced";
  profit?: number;
  roi?: number;
  note: string | null;
  incomes: IncomeCost[];
  costs: IncomeCost[];
};
