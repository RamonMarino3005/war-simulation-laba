import {
  ActionLog,
  ArmyState,
  BattleResult,
  RoundLog,
} from "types/entities/battleTypes.js";
import {
  applyDamage,
  calculateDamage,
  createResult,
  getArmyDetails,
} from "./utils.js";
import { ar } from "zod/locales";

export function simulateBattle(
  armyA: ArmyState,
  armyB: ArmyState,
  effectivenessMatrix: (attackerId: number, defenderId: number) => number,
  maxRounds = 20
): BattleResult {
  const { total_units: startingUnitsA, total_strength: startingStrengthA } =
    getArmyDetails(armyA);
  const { total_units: startingUnitsB, total_strength: startingStrengthB } =
    getArmyDetails(armyB);

  const rounds: RoundLog[] = [];

  for (let round = 1; round <= maxRounds; round++) {
    const actions: ActionLog[] = [];

    // A attacks B
    for (const unitA of armyA.units.filter((u) => u.quantity > 0)) {
      for (const unitB of armyB.units.filter((u) => u.quantity > 0)) {
        const eff = effectivenessMatrix(unitA.unit_type_id, unitB.unit_type_id);
        const damage = calculateDamage(unitA, unitB, eff);
        const casualties = applyDamage(unitB, damage);

        if (casualties > 0) {
          actions.push({
            attackerArmyId: armyA.armyId,
            defenderArmyId: armyB.armyId,
            unitType: unitA.type,
            targetType: unitB.type,
            damage,
            casualties,
          });
        }
      }
    }

    // B attacks A
    for (const unitB of armyB.units.filter((u) => u.quantity > 0)) {
      for (const unitA of armyA.units.filter((u) => u.quantity > 0)) {
        const eff = effectivenessMatrix(unitB.unit_type_id, unitA.unit_type_id);
        const damage = calculateDamage(unitB, unitA, eff);
        const casualties = applyDamage(unitA, damage);

        if (casualties > 0) {
          actions.push({
            attackerArmyId: armyB.armyId,
            defenderArmyId: armyA.armyId,
            unitType: unitB.type,
            targetType: unitA.type,
            damage,
            casualties,
          });
        }
      }
    }

    armyA.units = armyA.units.filter((u) => u.quantity > 0);
    armyB.units = armyB.units.filter((u) => u.quantity > 0);

    rounds.push({ round, actions });

    // Check for end condition
    const aliveA = armyA.units.length > 0;
    const aliveB = armyB.units.length > 0;

    if (!aliveA || !aliveB) {
      return createResult(
        armyA,
        armyB,
        rounds,
        startingStrengthA,
        startingStrengthB,
        startingUnitsA,
        startingUnitsB,
        aliveA ? armyA.armyId : aliveB ? armyB.armyId : null
      );
    }
  }

  // Timeout → winner decided by who has more total units left
  const totalA = armyA.units.reduce((sum, u) => sum + u.quantity, 0);
  const totalB = armyB.units.reduce((sum, u) => sum + u.quantity, 0);

  return createResult(
    armyA,
    armyB,
    rounds,
    startingStrengthA,
    startingStrengthB,
    startingUnitsA,
    startingUnitsB,
    totalA > totalB ? armyA.armyId : totalB > totalA ? armyB.armyId : null
  );
}
