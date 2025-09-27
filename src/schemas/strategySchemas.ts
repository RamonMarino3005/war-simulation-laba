import z from "zod";

export const createStrategySchema = z.object({
  name: z.string().min(2).max(100),
  offensive_bonus: z.number().min(0.5).max(1.5).optional().default(1),
  defensive_bonus: z.number().min(0.5).max(1.5).optional().default(1),
});

export const updateStrategySchema = z.object({
  name: z.string().min(2).max(100).optional(),
  offensive_bonus: z.number().min(0.5).max(1.5).optional(),
  defensive_bonus: z.number().min(0.5).max(1.5).optional(),
});
