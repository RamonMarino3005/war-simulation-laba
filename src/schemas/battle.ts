import z from "zod";

export const startBattleSchema = z.object({
  attackerArmyId: z.uuid(),
  defenderArmyId: z.uuid(),
  location: z.string().min(3).max(100),
  attackerStrategy: z.number(),
  defenderStrategy: z.number(),
});
