import { Battle, BattleArmy } from "types/entities/battleTypes.js";

export interface IBattleModel {
  createBattle(location: string): Promise<any>;

  createBattleArmy(
    battleId: string,
    army_id: string,
    strategy_id: number,
    role: "attacker" | "defender",
    outcome: "won" | "lost",
    starting_strength: number,
    final_strength: number,
    casualties: number
  ): Promise<any>;

  findAll(): Promise<Battle[]>;

  findById(battleId: string): Promise<Battle | null>;

  findByArmyId(armyId: string): Promise<BattleArmy[]>;

  delete(battleId: string): Promise<void>;

  getReport(battleId: string): Promise<any>;
}
