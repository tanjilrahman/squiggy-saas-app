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
  id?: string;
  name?: string;
  value: number;
  yoy?: number;
  type: string;
};

export type Asset = {
  id: string;
  name: string;
  value: number;
  category: string;
  yoy?: number;
  profit?: number;
  roi?: number;
  note: string | null;
  incomes: IncomeCost[];
  costs: IncomeCost[];
};
