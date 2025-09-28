import { startBattleSchema } from "../battle.js";

describe("startBattleSchema", () => {
  const validData = {
    attackerArmyId: crypto.randomUUID(),
    defenderArmyId: crypto.randomUUID(),
    location: "Battlefield 1",
    attackerStrategy: 1,
    defenderStrategy: 2,
  };

  it("should pass with valid data", () => {
    const result = startBattleSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.attackerArmyId).toBe(validData.attackerArmyId);
      expect(result.data.defenderArmyId).toBe(validData.defenderArmyId);
      expect(result.data.location).toBe(validData.location);
      expect(result.data.attackerStrategy).toBe(validData.attackerStrategy);
      expect(result.data.defenderStrategy).toBe(validData.defenderStrategy);
    }
  });

  it("should fail with invalid UUIDs", () => {
    const result = startBattleSchema.safeParse({
      ...validData,
      attackerArmyId: "invalid-uuid",
    });
    expect(result.success).toBe(false);

    const result2 = startBattleSchema.safeParse({
      ...validData,
      defenderArmyId: "not-a-uuid",
    });
    expect(result2.success).toBe(false);
  });

  it("should fail with too short location", () => {
    const result = startBattleSchema.safeParse({
      ...validData,
      location: "ab",
    });
    expect(result.success).toBe(false);
  });

  it("should fail with too long location", () => {
    const longLocation = "a".repeat(101);
    const result = startBattleSchema.safeParse({
      ...validData,
      location: longLocation,
    });
    expect(result.success).toBe(false);
  });

  it("should fail if strategies are not numbers", () => {
    const result1 = startBattleSchema.safeParse({
      ...validData,
      attackerStrategy: "1",
    });
    const result2 = startBattleSchema.safeParse({
      ...validData,
      defenderStrategy: "2",
    });
    expect(result1.success).toBe(false);
    expect(result2.success).toBe(false);
  });

  it("should fail if any field is missing", () => {
    const { attackerArmyId, ...partialData } = validData;
    const result = startBattleSchema.safeParse(partialData);
    expect(result.success).toBe(false);
  });
});
