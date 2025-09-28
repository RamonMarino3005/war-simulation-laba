"use strict";
// __tests__/calculateDamage.test.ts
import { UnitInArmy } from "../../../src/types/entities/armyUnitTypes.js";
import {
  calculateDamage,
  applyDamage,
  createEffectivenessMatrix,
  addPerks,
  getArmyDetails,
  createResult,
} from "../../../src/services/Battle/utils.js";
import { beforeEach, describe, expect, it } from "@jest/globals";
import {
  ArmyState,
  BattleResult,
  RoundLog,
  UnitInCombat,
} from "../../../src/types/entities/battleTypes.js";
import { EffectivenessRelation } from "../../../src/types/entities/unitTypes.js";
import { Strategy } from "../../../src/types/entities/strategyTypes.js";

describe("calculateDamage", () => {
  let attacker: UnitInArmy;
  let defender: UnitInArmy;

  beforeEach(() => {
    attacker = {
      unit_type_id: 1,
      type: "infantry",
      cost: 100,
      quantity: 10,
      strength: 5,
      base_health: 100,
      defense: 2,
    };
    defender = {
      unit_type_id: 2,
      type: "cavalry",
      cost: 150,
      quantity: 8,
      strength: 4,
      base_health: 80,
      defense: 3,
    };
  });

  it("should calculate damage correctly with effectiveness = 1", () => {
    const result = calculateDamage(attacker, defender, 1);
    expect(result).toBe(10 * 5 * 1); // 50
  });

  it("should scale damage with effectiveness > 1", () => {
    const result = calculateDamage(attacker, defender, 1.5);
    expect(result).toBe(10 * 5 * 1.5); // 75
  });

  it("should reduce damage with effectiveness < 1", () => {
    const result = calculateDamage(attacker, defender, 0.5);
    expect(result).toBe(10 * 5 * 0.5); // 25
  });

  it("should return 0 if attacker has 0 quantity", () => {
    attacker.quantity = 0;
    const result = calculateDamage(attacker, defender, 1);
    expect(result).toBe(0);
  });

  it("should return 0 if attacker strength is 0", () => {
    attacker.strength = 0;
    const result = calculateDamage(attacker, defender, 1);
    expect(result).toBe(0);
  });

  it("should handle effectiveness = 0", () => {
    const result = calculateDamage(attacker, defender, 0);
    expect(result).toBe(0);
  });
});

/**
 * Tests for applyDamage function
 */
describe("applyDamage", () => {
  let defender: UnitInArmy;
  beforeEach(() => {
    defender = {
      unit_type_id: 1,
      type: "infantry",
      cost: 100,
      strength: 5,
      defense: 2,
      quantity: 10,
      base_health: 10,
    };
  });
  it("reduces quantity by full casualties when damage is enough", () => {
    const defenderInCombat: UnitInCombat = {
      ...defender,
      total_health: 10,
      damage_buffer: 0,
    };

    const casualties = applyDamage(defenderInCombat, 50);

    expect(casualties).toBe(5);
    expect(defenderInCombat.quantity).toBe(5);
    expect(defenderInCombat.damage_buffer).toBe(0);
  });

  it("caps casualties at remaining quantity", () => {
    const defenderInCombat: UnitInCombat = {
      ...defender,
      quantity: 3,
      total_health: 10,
      damage_buffer: 0,
    };

    const casualties = applyDamage(defenderInCombat, 50);
    expect(casualties).toBe(3);
    expect(defenderInCombat.quantity).toBe(0);
    expect(defenderInCombat.damage_buffer).toBe(0);
  });

  it("stores leftover damage in damage_buffer if not enough to kill a unit", () => {
    const defenderInCombat: UnitInCombat = {
      ...defender,
      quantity: 5,
      base_health: 10,
      total_health: 10,
      damage_buffer: 0,
    };

    const casualties = applyDamage(defenderInCombat, 7); // less than total_health
    expect(casualties).toBe(0);
    expect(defenderInCombat.quantity).toBe(5);
    expect(defenderInCombat.damage_buffer).toBe(7);
  });

  it("applies buffered damage on next call", () => {
    const defenderInCombat: UnitInCombat = {
      ...defender,
      quantity: 5,
      base_health: 10,
      total_health: 10,
      damage_buffer: 3,
    };

    const casualties = applyDamage(defenderInCombat, 6);
    expect(casualties).toBe(0);
    expect(defenderInCombat.quantity).toBe(5);
    expect(defenderInCombat.damage_buffer).toBe(9);
  });

  it("calculates casualties correctly when combined damage and buffer exceed total_health", () => {
    const defenderInCombat: UnitInCombat = {
      ...defender,
      quantity: 5,
      base_health: 10,
      total_health: 10,
      damage_buffer: 3,
    };

    const casualties = applyDamage(defenderInCombat, 8); // totalDamage = 11
    expect(casualties).toBe(1); // kills 1 unit
    expect(defenderInCombat.quantity).toBe(4);
    expect(defenderInCombat.damage_buffer).toBe(1); // leftover after killing 1 unit
  });
});

/**
 * Tests for createEffectivenessMatrix function
 */
describe("createEffectivenessMatrix", () => {
  it("should return 1 for any pair if matrix is empty", () => {
    const matrixFn = createEffectivenessMatrix([]);

    expect(matrixFn(1, 2)).toBe(1);
    expect(matrixFn(99, 100)).toBe(1);
  });

  it("should return correct modifier for defined pairs", () => {
    const effectivenessData: EffectivenessRelation[] = [
      { attacker_unit_id: 1, defender_unit_id: 2, modifier: 1.5 },
      { attacker_unit_id: 1, defender_unit_id: 3, modifier: 0.5 },
      { attacker_unit_id: 2, defender_unit_id: 1, modifier: 2 },
    ];

    const matrixFn = createEffectivenessMatrix(effectivenessData);

    expect(matrixFn(1, 2)).toBe(1.5);
    expect(matrixFn(1, 3)).toBe(0.5);
    expect(matrixFn(2, 1)).toBe(2);
  });

  it("should return 1 for pairs not defined in matrix", () => {
    const effectivenessData: EffectivenessRelation[] = [
      { attacker_unit_id: 1, defender_unit_id: 2, modifier: 1.5 },
    ];
    const matrixFn = createEffectivenessMatrix(effectivenessData);

    expect(matrixFn(2, 1)).toBe(1);
    expect(matrixFn(1, 3)).toBe(1);
  });
});

describe("addPerks", () => {
  let defaultUnit: UnitInArmy;
  let defaultStrategy: Strategy;

  beforeEach(() => {
    defaultUnit = {
      unit_type_id: 1,
      cost: 100,
      type: "infantry",
      quantity: 10,
      base_health: 50,
      strength: 20,
      defense: 10,
    };

    defaultStrategy = {
      id: 1000000, // avoid conflicts with real strategies
      name: "custom",
      offensive_bonus: 1,
      defensive_bonus: 1,
    };
  });

  it("should modify strength and total_health correctly", () => {
    const unit: UnitInArmy = {
      ...defaultUnit,
      strength: 30,
      base_health: 50,
      defense: 15,
    };
    const strategy: Strategy = {
      ...defaultStrategy,
      offensive_bonus: 1.5,
      defensive_bonus: 0.8,
    };

    const unitInCombat = addPerks(unit, strategy);

    expect(unitInCombat.strength).toBe(30 * 1.5); // strength with offensive bonus
    expect(unitInCombat.total_health).toBe((50 + 15) * 0.8); // total_health with defensive bonus
  });

  it("should correctly calculate total_health with defensive bonus", () => {
    const unit: UnitInArmy = {
      ...defaultUnit,
      quantity: 5,
      base_health: 40,
      strength: 15,
      defense: 10,
    };
    const strategy: Strategy = {
      ...defaultStrategy,
      offensive_bonus: 0.5,
      defensive_bonus: 1.5,
    };

    const unitInCombat = addPerks(unit, strategy);

    expect(unitInCombat.strength).toBe(15 * 0.5); // strength with offensive bonus
    // (base_health + defense) * defensive_bonus = (40 + 10) * 1.5 = 75
    expect(unitInCombat.total_health).toBe(75);
  });

  it("should correctly apply offensive bonus to strength", () => {
    const unit: UnitInArmy = {
      ...defaultUnit,
      quantity: 3,
      base_health: 30,
      strength: 10,
      defense: 5,
    };
    const strategy: Strategy = {
      ...defaultStrategy,
      offensive_bonus: 1.3,
      defensive_bonus: 1,
    };

    const unitInCombat = addPerks(unit, strategy);

    // strength * offensive_bonus = 10 * 1.3 = 13
    expect(unitInCombat.strength).toBe(13);
  });

  it("should preserve other unit properties", () => {
    const unit: UnitInArmy = {
      ...defaultUnit,
      unit_type_id: 42,
      quantity: 7,
      base_health: 25,
      strength: 5,
      defense: 5,
    };
    const strategy: Strategy = {
      ...defaultStrategy,
      offensive_bonus: 1,
      defensive_bonus: 1,
    };

    const unitInCombat = addPerks(unit, strategy);

    expect(unitInCombat.unit_type_id).toBe(42);
    expect(unitInCombat.quantity).toBe(7);
    expect(unitInCombat.base_health).toBe(25);
    expect(unitInCombat.defense).toBe(5);
  });
});

describe("getArmyDetails", () => {
  let defaultUnitInCombat: UnitInCombat;

  beforeEach(() => {
    defaultUnitInCombat = {
      unit_type_id: 1,
      type: "infantry",
      cost: 100,
      quantity: 10,
      base_health: 50,
      strength: 20,
      defense: 10,
      total_health: 60,
      damage_buffer: 0,
    };
  });

  it("should correctly compute total_strength", () => {
    const army: ArmyState = {
      armyId: crypto.randomUUID(),
      units: [
        {
          ...defaultUnitInCombat,
          unit_type_id: 1,
          quantity: 3,
          strength: 10,
          base_health: 50,
          defense: 5,
        },
        {
          ...defaultUnitInCombat,
          unit_type_id: 2,
          quantity: 2,
          strength: 20,
          base_health: 40,
          defense: 10,
        },
      ],
      role: "attacker",
    };

    const details = getArmyDetails(army);

    // 3*10 + 2*20 = 30 + 40 = 70
    expect(details.total_strength).toBe(70);
  });

  it("should correctly compute total_defense", () => {
    const army: ArmyState = {
      armyId: crypto.randomUUID(),
      role: "defender",
      units: [
        {
          ...defaultUnitInCombat,
          unit_type_id: 1,
          quantity: 3,
          strength: 10,
          base_health: 50,
          defense: 5,
        },
        {
          ...defaultUnitInCombat,
          unit_type_id: 2,
          quantity: 2,
          strength: 20,
          base_health: 40,
          defense: 10,
        },
      ],
    };

    const details = getArmyDetails(army);

    expect(details.total_defense).toBe(165 + 100);
  });

  it("should correctly compute total_units", () => {
    const army: ArmyState = {
      armyId: crypto.randomUUID(),
      role: "defender",
      units: [
        {
          ...defaultUnitInCombat,
          unit_type_id: 1,
          quantity: 3,
          strength: 10,
          base_health: 50,
          defense: 5,
        },
        {
          ...defaultUnitInCombat,
          unit_type_id: 2,
          quantity: 2,
          strength: 20,
          base_health: 40,
          defense: 10,
        },
      ],
    };

    const details = getArmyDetails(army);

    expect(details.total_units).toBe(5);
  });

  it("should handle empty armies", () => {
    const army: ArmyState = {
      units: [],
      armyId: crypto.randomUUID(),
      role: "attacker",
    };

    const details = getArmyDetails(army);

    expect(details.total_strength).toBe(0);
    expect(details.total_defense).toBe(0);
    expect(details.total_units).toBe(0);
  });
});

describe("createResult", () => {
  let defaultArmyState: ArmyState = {
    units: [],
    armyId: crypto.randomUUID(),
    role: "attacker",
  };

  let defaultUnitInCombat: UnitInCombat = {
    unit_type_id: 1,
    type: "infantry",
    cost: 100,
    quantity: 10,
    base_health: 50,
    strength: 20,
    defense: 10,
    total_health: 60,
    damage_buffer: 0,
  };

  beforeAll(() => {
    defaultArmyState = {
      units: [],
      armyId: crypto.randomUUID(),
      role: "attacker",
    };

    defaultUnitInCombat = {
      unit_type_id: 1,
      type: "infantry",
      cost: 100,
      quantity: 10,
      base_health: 50,
      strength: 20,
      defense: 10,
      total_health: 60,
      damage_buffer: 0,
    };
  });

  beforeEach(() => {
    defaultArmyState = {
      units: [],
      armyId: crypto.randomUUID(),
      role: "attacker",
    };

    defaultUnitInCombat = {
      unit_type_id: 1,
      type: "infantry",
      cost: 100,
      quantity: 10,
      base_health: 50,
      strength: 20,
      defense: 10,
      total_health: 60,
      damage_buffer: 0,
    };
  });

  const armyA: ArmyState = {
    ...defaultArmyState,
    units: [
      {
        ...defaultUnitInCombat,
        unit_type_id: 1,
        quantity: 3,
        strength: 10,
        base_health: 50,
        defense: 5,
      },
      {
        ...defaultUnitInCombat,
        unit_type_id: 2,
        quantity: 2,
        strength: 20,
        base_health: 40,
        defense: 10,
      },
    ],
  };

  const armyB: ArmyState = {
    ...defaultArmyState,
    units: [
      {
        ...defaultUnitInCombat,
        unit_type_id: 3,
        quantity: 4,
        strength: 15,
        base_health: 30,
        defense: 5,
      },
      {
        ...defaultUnitInCombat,
        unit_type_id: 4,
        quantity: 1,
        strength: 50,
        base_health: 60,
        defense: 10,
      },
    ],
  };

  const rounds: RoundLog[] = [
    { round: 1, actions: [] },
    { round: 2, actions: [] },
  ];

  it("should create a correct battle result for given armies", () => {
    const startingStrengthA = 3 * 10 + 2 * 20;
    const startingStrengthB = 4 * 15 + 1 * 50;
    const startingUnitsA = 3 + 2;
    const startingUnitsB = 4 + 1;
    const winnerId = "armyA";

    const result: BattleResult = createResult(
      armyA,
      armyB,
      rounds,
      startingStrengthA,
      startingStrengthB,
      startingUnitsA,
      startingUnitsB,
      winnerId
    );

    expect(result.winner).toBe("armyA");
    expect(result.attackerStats.casualties).toBe(0);
    expect(result.attackerStats.starting_strength).toBe(startingStrengthA);
    expect(result.attackerStats.final_strength).toBe(70);

    expect(result.defenderStats.casualties).toBe(0);
    expect(result.defenderStats.starting_strength).toBe(startingStrengthB);
    expect(result.defenderStats.final_strength).toBe(110);

    expect(result.total_rounds).toBe(2);
    expect(result.rounds).toEqual(rounds);
  });

  it("should handle null winner", () => {
    const result: BattleResult = createResult(
      armyA,
      armyB,
      [],
      70,
      110,
      5,
      5,
      null
    );

    expect(result.winner).toBeNull();
    expect(result.total_rounds).toBe(0);
  });

  it("should compute casualties correctly if units lost", () => {
    const armyALost: ArmyState = {
      ...defaultArmyState,
      units: [
        {
          ...defaultUnitInCombat,
          unit_type_id: 1,
          quantity: 1,
          strength: 10,
          base_health: 50,
          defense: 5,
        },
        {
          ...defaultUnitInCombat,
          unit_type_id: 2,
          quantity: 1,
          strength: 20,
          base_health: 40,
          defense: 10,
        },
      ],
    };

    const armyBLost: ArmyState = {
      ...defaultArmyState,
      units: [
        {
          ...defaultUnitInCombat,
          unit_type_id: 3,
          quantity: 2,
          strength: 15,
          base_health: 30,
          defense: 5,
        },
        {
          ...defaultUnitInCombat,
          unit_type_id: 4,
          quantity: 0,
          strength: 50,
          base_health: 60,
          defense: 10,
        },
      ],
    };

    const result: BattleResult = createResult(
      armyALost,
      armyBLost,
      rounds,
      70,
      110,
      5,
      5,
      "armyB"
    );

    expect(result.attackerStats.casualties).toBe(5 - (1 + 1));
    expect(result.defenderStats.casualties).toBe(5 - (2 + 0));
  });
});
