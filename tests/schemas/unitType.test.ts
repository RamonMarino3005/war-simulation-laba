import {
  unitTypeSchema,
  effectivenessArraySchema,
  unitTypeCreateSchema,
} from "../../src/schemas/unitType.js";

describe("unitTypeSchema", () => {
  const validUnit = {
    type: "Archer",
    base_health: 50,
    strength: 20,
    defense: 10,
    cost: 100,
  };

  it("should pass with valid data", () => {
    const result = unitTypeSchema.safeParse(validUnit);
    expect(result.success).toBe(true);
  });

  it("should fail if type is too short or too long", () => {
    expect(unitTypeSchema.safeParse({ ...validUnit, type: "A" }).success).toBe(
      false
    );
    expect(
      unitTypeSchema.safeParse({ ...validUnit, type: "A".repeat(16) }).success
    ).toBe(false);
  });

  it("should fail if base_health, strength, defense, or cost are invalid", () => {
    expect(
      unitTypeSchema.safeParse({ ...validUnit, base_health: -1 }).success
    ).toBe(false);
    expect(
      unitTypeSchema.safeParse({ ...validUnit, strength: 0 }).success
    ).toBe(false);
    expect(
      unitTypeSchema.safeParse({ ...validUnit, defense: 101 }).success
    ).toBe(false);
    expect(unitTypeSchema.safeParse({ ...validUnit, cost: 0 }).success).toBe(
      false
    );
  });
});

describe("effectivenessArraySchema", () => {
  const validEffectiveness = [
    { against: "Cavalry", attacker_modifier: 1.2, defender_modifier: 0.8 },
    { against: "Infantry" },
  ];

  it("should pass with valid data", () => {
    const result = effectivenessArraySchema.safeParse(validEffectiveness);
    expect(result.success).toBe(true);
  });

  it("should fail if 'against' is too short or too long", () => {
    const invalid = [{ against: "A" }];
    expect(effectivenessArraySchema.safeParse(invalid).success).toBe(false);
  });

  it("should fail if modifiers are out of bounds", () => {
    const invalid = [
      { against: "Cavalry", attacker_modifier: 0.05, defender_modifier: 6 },
    ];
    expect(effectivenessArraySchema.safeParse(invalid).success).toBe(false);
  });
});

describe("unitTypeCreateSchema", () => {
  const validUnitWithEffectiveness = {
    type: "Archer",
    base_health: 50,
    strength: 20,
    defense: 10,
    cost: 100,
    effectiveness: [
      { against: "Cavalry", attacker_modifier: 1.5, defender_modifier: 0.7 },
    ],
  };

  it("should pass when effectiveness is provided", () => {
    const result = unitTypeCreateSchema.safeParse(validUnitWithEffectiveness);
    expect(result.success).toBe(true);
  });

  it("should pass when effectiveness is omitted", () => {
    const { effectiveness, ...unitWithoutEffectiveness } =
      validUnitWithEffectiveness;
    const result = unitTypeCreateSchema.safeParse(unitWithoutEffectiveness);
    expect(result.success).toBe(true);
  });

  it("should fail if any field in unitType or effectiveness is invalid", () => {
    const invalidUnit = { ...validUnitWithEffectiveness, base_health: -5 };
    const result = unitTypeCreateSchema.safeParse(invalidUnit);
    expect(result.success).toBe(false);

    const invalidEffectiveness = {
      ...validUnitWithEffectiveness,
      effectiveness: [{ against: "A", attacker_modifier: 10 }],
    };
    const result2 = unitTypeCreateSchema.safeParse(invalidEffectiveness);
    expect(result2.success).toBe(false);
  });
});
