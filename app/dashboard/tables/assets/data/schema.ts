import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: z.string(),
  label: z.string(),
  yoy: z.string(),
  value: z.number(),
  profit: z.number(),
  roi: z.number()
})

export type Task = z.infer<typeof taskSchema>
