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
