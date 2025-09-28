import { UnitInArmy } from "types/entities/armyUnitTypes.js";
import {
  ArmyState,
  RoundLog,
  BattleResult,
  UnitInCombat,
} from "types/entities/battleTypes.js";
import { Strategy } from "types/entities/strategyTypes.js";
import { EffectivenessRelation } from "types/entities/unitTypes.js";

export function calculateDamage(
  attacker: UnitInArmy,
  defender: UnitInArmy,
  effectiveness: number
): number {
  const attackPower = attacker.quantity * attacker.strength * effectiveness;

  return attackPower;
}

export function applyDamage(defender: UnitInCombat, damage: number): number {
  let totalDamage = damage + defender.damage_buffer;

  const potentialCasualties = Math.floor(totalDamage / defender.total_health);

  const casualties = Math.min(defender.quantity, potentialCasualties);

  defender.quantity -= casualties;

  defender.damage_buffer = totalDamage % defender.total_health;

  return casualties;
}

export function createEffectivenessMatrix(
  effectivenessData: EffectivenessRelation[]
): (attackerId: number, defenderId: number) => number {
  const matrix: Record<number, Record<number, number>> = {};

  for (const {
    attacker_unit_id,
    defender_unit_id,
    modifier: multiplier,
  } of effectivenessData) {
    if (!matrix[attacker_unit_id]) {
      matrix[attacker_unit_id] = {};
    }
    matrix[attacker_unit_id][defender_unit_id] = multiplier;
  }

  return (attackerId, defenderId) => matrix[attackerId]?.[defenderId] || 1;
}

export function addPerks(unit: UnitInArmy, strategy: Strategy): UnitInCombat {
  return {
    ...unit,
    damage_buffer: 0,
    total_health: (unit.base_health + unit.defense) * strategy.defensive_bonus,
    strength: unit.strength * strategy.offensive_bonus,
  };
}

export function getArmyDetails(armyState: ArmyState) {
  return {
    total_strength: armyState.units.reduce(
      (sum, u) => sum + u.quantity * u.strength,
      0
    ),
    total_defense: armyState.units.reduce(
      (sum, u) => sum + u.quantity * (u.base_health + u.defense),
      0
    ),
    total_units: armyState.units.reduce((sum, u) => sum + u.quantity, 0),
  };
}

export function createResult(
  armyA: ArmyState,
  armyB: ArmyState,
  rounds: RoundLog[],
  startingStrengthA: number,
  startingStrengthB: number,
  startingUnitsA: number,
  startingUnitsB: number,
  winnerId: string | null
): BattleResult {
  const { total_units: endingUnitsA, total_strength: final_strengthA } =
    getArmyDetails(armyA);
  const { total_units: endingUnitsB, total_strength: final_strengthB } =
    getArmyDetails(armyB);

  const casualtiesA = startingUnitsA - endingUnitsA;
  const casualtiesB = startingUnitsB - endingUnitsB;

  return {
    winner: winnerId,
    attackerStats: {
      casualties: casualtiesA,
      starting_strength: startingStrengthA,
      final_strength: final_strengthA,
    },
    defenderStats: {
      casualties: casualtiesB,
      starting_strength: startingStrengthB,
      final_strength: final_strengthB,
    },
    total_rounds: rounds.length,
    rounds,
  };
}
