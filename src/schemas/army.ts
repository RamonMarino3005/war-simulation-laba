import z, { ZodError } from "zod";

export const armySchema = z.object({
  name: z
    .string()
    .min(3, { error: "Army name must be at least 3 characters" })
    .max(30, { error: "Army name must be at most 15 characters" }),
  resources: z.number().int().min(0),
});

export function zodValidateArmyCreation(object: any) {
  return armySchema.pick({ name: true }).safeParse(object);
}

export function zodValidateArmyFields(object: any) {
  return armySchema.safeParse(object);
}
