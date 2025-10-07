import { z } from "zod"

export const BlockUserSchema = z.object({
  block: z.boolean(),
  reason: z.string().max(200).nullish(),
})

export const BulkIdsSchema = z.object({ ids: z.array(z.string().cuid()).min(1) })
