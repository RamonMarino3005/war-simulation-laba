import z from "zod";

export const updateArmyUnitBodySchema = z.object({
  quantity: z.number().refine((n) => n !== 0, {
    message: "Quantity cannot be zero",
  }),
});

export const createArmyUnitBodySchema = z.object({
  quantity: z
    .number()
    .int()
    .min(1, { message: "Quantity must be at least 1" })
    .optional()
    .default(1),
});
