// import { z } from "zod"

// // We're keeping a simple non-relational schema here.
// // IRL, you will have a schema for your data models.
// export const taskSchema = z.object({
//   id: z.string(),
//   name: z.string(),
//   category: z.string(),
//   label: z.string(),
//   yoy: z.string(),
//   value: z.number(),
//   profit: z.number(),
//   roi: z.number()
// })

// export type Task = z.infer<typeof taskSchema>

export type AssetIn = {
  id: string;
  assetId: string;
  allocation: number;
  type: "absolute" | "cumulative";
};

export type Action = {
  id: string;
  name: string;
  timeframe: number[];
  assetIns: AssetIn[];
  assetOut: string;
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
