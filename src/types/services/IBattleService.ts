import { Battle, BattleArmy } from "types/entities/battleTypes.js";

export interface IBattleService {
  startBattle(
    attackerArmyId: string,
    defenderArmyId: string,
    location: string,
    attackerStrategy: number,
    defenderStrategy: number
  ): Promise<any>;

  getAllBattles(): Promise<Battle[]>;

  getBattleById(battleId: string): Promise<Battle | null>;

  getBattlesByArmyId(armyId: string): Promise<BattleArmy[]>;

  deleteBattle(battleId: string): Promise<void>;

  getBattleReport(battleId: string): Promise<any>;
}
