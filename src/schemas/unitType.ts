import z, { optional, ZodError } from "zod";
import { de } from "zod/locales";

export const unitTypeSchema = z.object({
  type: z
    .string()
    .min(3, { error: "Type must be at least 3 characters" })
    .max(15, { error: "Type must be at most 15 characters" }),
  base_health: z
    .number()
    .int()
    .positive({ error: "Base health must be a positive number" }),
  strength: z
    .number()
    .min(1, { error: "Strength must be at least 1" })
    .max(100, { error: "Strength must be at most 100" }),
  defense: z
    .number()
    .min(1, { error: "Defense must be at least 1" })
    .max(100, { error: "Defense must be at most 100" }),
  cost: z.number().positive({ error: "Cost must be a positive number" }),
});

export const effectivenessArraySchema = z.array(
  z.object({
    against: z.string().min(3).max(15),
    attacker_modifier: z.number().min(0.1).max(5).optional(),
    defender_modifier: z.number().min(0.1).max(5).optional(),
  })
);

export const unitTypeCreateSchema = unitTypeSchema.extend({
  effectiveness: effectivenessArraySchema.optional(),
});
