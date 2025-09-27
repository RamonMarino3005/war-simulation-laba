import { UnitInArmy } from "./armyUnitTypes.js";

export type Battle = {
  id: string;
  location: string;
  date: Date;
};

export type BattleFields = Omit<Battle, "id" | "date">;

export type UnitInCombat = UnitInArmy & {
  damage_buffer: number;
  total_health: number;
};

export type StartBattleFields = {
  attackerArmyId: string;
  defenderArmyId: string;
  location: string;
  attackerStrategy: number;
  defenderStrategy: number;
};

export type BattleArmy = {
  battleId: string;
  armyId: string;
  strategyId: number;
  role: "attacker" | "defender";
  outcome: "won" | "lost" | "draw";
};

export type StrategyBonus = {
  attack: number;
  defense: number;
};

export type ArmyState = {
  armyId: string;
  units: UnitInCombat[];
  role: "attacker" | "defender";
};

export type ActionLog = {
  attackerArmyId: string;
  defenderArmyId: string;
  unitType: string;
  targetType: string;
  damage: number;
  casualties: number;
};

export type RoundLog = {
  round: number;
  actions: ActionLog[];
};

type BattleArmyStats = {
  casualties: number;
  starting_strength: number;
  final_strength: number;
};

export type BattleResult = {
  winner: string | null;
  attackerStats: BattleArmyStats;
  defenderStats: BattleArmyStats;
  total_rounds: number;
  rounds: RoundLog[];
};

export type BattleLog = {
  winner:
    | {
        army_id: string;
        role: "attacker" | "defender";
        name: string;
      }
    | "draw";
  attackerStats: BattleArmyStats;
  defenderStats: BattleArmyStats;
  total_rounds: number;
  rounds: RoundLog[];
};
