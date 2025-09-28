import { z } from "zod";
import {
  updateArmyUnitBodySchema,
  createArmyUnitBodySchema,
} from "../armyUnit.js";

describe("updateArmyUnitBodySchema", () => {
  it("should pass with a valid quantity", () => {
    const result = updateArmyUnitBodySchema.safeParse({ quantity: 5 });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.quantity).toBe(5);
    }
  });

  it("should pass with a negative quantity", () => {
    const result = updateArmyUnitBodySchema.safeParse({ quantity: -5 });

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.quantity).toBe(-5);
    }
  });

  it("should fail with quantity zero", () => {
    const result = updateArmyUnitBodySchema.safeParse({ quantity: 0 });
    expect(result.success).toBe(false);
  });

  it("should fail with an array instead of quantity", () => {
    const result = updateArmyUnitBodySchema.safeParse({ quantity: [] });
    expect(result.success).toBe(false);
  });

  it("should fail with a non-number quantity", () => {
    const result = updateArmyUnitBodySchema.safeParse({ quantity: "5" });
    expect(result.success).toBe(false);
  });

  it("should fail with missing quantity", () => {
    const result = updateArmyUnitBodySchema.safeParse({});
    expect(result.success).toBe(false);
  });
});

describe("createArmyUnitBodySchema", () => {
  it("should pass with a valid quantity", () => {
    const result = createArmyUnitBodySchema.safeParse({ quantity: 10 });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.quantity).toBe(10);
    }
  });

  it("should use default quantity if not provided", () => {
    const result = createArmyUnitBodySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.quantity).toBe(1);
    }
  });

  it("should fail with quantity zero", () => {
    const result = createArmyUnitBodySchema.safeParse({ quantity: 0 });
    expect(result.success).toBe(false);
  });

  it("should fail with a negative quantity", () => {
    const result = createArmyUnitBodySchema.safeParse({ quantity: -5 });
    expect(result.success).toBe(false);
  });

  it("should fail with a non-integer quantity", () => {
    const result = createArmyUnitBodySchema.safeParse({ quantity: 1.5 });
    expect(result.success).toBe(false);
  });

  it("should fail with wrong type quantity", () => {
    const result = createArmyUnitBodySchema.safeParse({ quantity: "3" });
    expect(result.success).toBe(false);
  });
});
