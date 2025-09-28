import { describe, it, expect } from "@jest/globals";
import {
  armySchema,
  zodValidateArmyCreation,
  zodValidateArmyFields,
} from "../army.js";

describe("Army Schemas", () => {
  const validArmy = {
    name: "Legion",
    resources: 100,
  };

  const invalidArmy = {
    name: "Le",
    resources: -10,
  };

  describe("armySchema", () => {
    it("should pass valid army", () => {
      const result = armySchema.safeParse(validArmy);

      expect(result.success).toBe(true);

      if (result.success) {
        expect(result.data).toEqual(validArmy);
      }
    });

    it("should fail invalid army", () => {
      const result = armySchema.safeParse(invalidArmy);

      expect(result.success).toBe(false);

      if (!result.success) {
        const errors = result.error.issues.map((e) => e.path[0]);
        expect(errors).toContain("name");
        expect(errors).toContain("resources");
      }
    });
  });

  describe("zodValidateArmyCreation", () => {
    it("should validate only the name field", () => {
      const result = zodValidateArmyCreation(validArmy);
      expect(result.success).toBe(true);

      const partial = { name: "A" };

      const fail = zodValidateArmyCreation(partial);

      expect(fail.success).toBe(false);
    });

    it("should ignore resources when validating creation", () => {
      const armyWithExtra = { name: "Legion", resources: -100 };

      const result = zodValidateArmyCreation(armyWithExtra);

      expect(result.success).toBe(true);
    });
  });

  describe("zodValidateArmyFields", () => {
    it("should validate all fields", () => {
      const result = zodValidateArmyFields(validArmy);

      expect(result.success).toBe(true);

      const resultInvalid = zodValidateArmyFields(invalidArmy);
      expect(resultInvalid.success).toBe(false);
    });
  });
});
