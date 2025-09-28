import {
  createStrategySchema,
  updateStrategySchema,
} from "../strategySchemas.js";

describe("createStrategySchema", () => {
  const validData = {
    name: "Aggressive",
    offensive_bonus: 1.2,
    defensive_bonus: 0.8,
  };

  it("should pass with valid data", () => {
    const result = createStrategySchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe(validData.name);
      expect(result.data.offensive_bonus).toBe(validData.offensive_bonus);
      expect(result.data.defensive_bonus).toBe(validData.defensive_bonus);
    }
  });

  it("should pass if optional bonuses are omitted", () => {
    const { offensive_bonus, defensive_bonus, ...partial } = validData;
    const result = createStrategySchema.safeParse(partial);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.offensive_bonus).toBe(1);
      expect(result.data.defensive_bonus).toBe(1);
    }
  });

  it("should fail with too short or too long name", () => {
    const resultShort = createStrategySchema.safeParse({
      ...validData,
      name: "A",
    });
    const resultLong = createStrategySchema.safeParse({
      ...validData,
      name: "A".repeat(101),
    });
    expect(resultShort.success).toBe(false);
    expect(resultLong.success).toBe(false);
  });

  it("should fail if bonuses are out of range", () => {
    const result1 = createStrategySchema.safeParse({
      ...validData,
      offensive_bonus: 0.4,
    });
    const result2 = createStrategySchema.safeParse({
      ...validData,
      defensive_bonus: 1.6,
    });
    expect(result1.success).toBe(false);
    expect(result2.success).toBe(false);
  });
});

describe("updateStrategySchema", () => {
  const validData = {
    name: "Defensive",
    offensive_bonus: 1.0,
    defensive_bonus: 1.3,
  };

  it("should pass with all optional fields present", () => {
    const result = updateStrategySchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should pass if some fields are omitted", () => {
    const result = updateStrategySchema.safeParse({ name: "Balanced" });
    expect(result.success).toBe(true);
  });

  it("should fail if fields are out of allowed range", () => {
    const result1 = updateStrategySchema.safeParse({ offensive_bonus: 0.4 });
    const result2 = updateStrategySchema.safeParse({ defensive_bonus: 1.6 });
    const result3 = updateStrategySchema.safeParse({ name: "A" });
    expect(result1.success).toBe(false);
    expect(result2.success).toBe(false);
    expect(result3.success).toBe(false);
  });
});
