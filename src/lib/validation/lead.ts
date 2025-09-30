import { z } from "zod";

export const LeadSchema = z.object({
  service: z.string().min(2),
  description: z.string().min(10),
  budgetMin: z.number().int().nonnegative().optional(),
  budgetMax: z.number().int().nonnegative().optional(),
  timeline: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  source: z.string().optional(), // e.g. "quote-wizard"
});
export type LeadInput = z.infer<typeof LeadSchema>;
