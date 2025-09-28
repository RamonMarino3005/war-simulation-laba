import {
  ArmyState,
  Battle,
  BattleLog,
  BattleReport,
  Winner,
} from "types/entities/battleTypes.js";
import { IBattleModel } from "types/models/IBattleModel.js";
import { IArmyService } from "types/services/IArmyService.js";
import { IArmyUnitService } from "types/services/IArmyUnitService.js";
import { IBattleService } from "types/services/IBattleService.js";
import { IStrategyService } from "types/services/IStrategyService.js";
import { simulateBattle } from "./battleSimulation.js";
import { addPerks, createEffectivenessMatrix } from "./utils.js";
import { IUnitTypeService } from "types/services/IUnitTypeService.js";
import { UnitInArmy } from "types/entities/armyUnitTypes.js";

export class BattleService implements IBattleService {
  constructor(
    private battleModel: IBattleModel,
    private armyService: IArmyService,
    private strategyService: IStrategyService,
    private armyUnitService: IArmyUnitService,
    private unitTypeService: IUnitTypeService
  ) {}

  async startBattle(
    attackerArmyId: string,
    defenderArmyId: string,
    location: string,
    attackerStrategyId: number,
    defenderStrategyId: number
  ): Promise<BattleLog> {
    /**
     * Fetch armies and validate
     * */
    const attackerArmy = await this.armyService.getArmyById(attackerArmyId);
    if (!attackerArmy) {
      throw new Error("Attacker army not found");
    }

    const defenderArmy = await this.armyService.getArmyById(defenderArmyId);
    if (!defenderArmy) {
      throw new Error("Defender army not found");
    }

    /**
     * Fetch strategies and validate
     */
    const strategyIds = await this.strategyService.getAllStrategies();
    const attackerStrategy = strategyIds.find(
      (s) => s.id === attackerStrategyId
    );
    const defenderStrategy = strategyIds.find(
      (s) => s.id === defenderStrategyId
    );
    if (!attackerStrategy || !defenderStrategy) {
      throw new Error("Invalid strategy");
    }

    /**
     * Fetch army units and validate
     */
    const attackerUnits: UnitInArmy[] = await this.armyUnitService
      .getUnitsInArmy(attackerArmyId)
      .then((response) => response.units);

    if (attackerUnits.length === 0) {
      throw new Error("Attacker army has no units");
    }

    const defenderUnits: UnitInArmy[] = await this.armyUnitService
      .getUnitsInArmy(defenderArmyId)
      .then((response) => response.units);

    if (defenderUnits.length === 0) {
      throw new Error("Defender army has no units");
    }

    /*** Prepare units for combat
     * - Apply strategy perks
     * - Initialize combat-specific fields
     */
    const attackerUnitsForCombat = attackerUnits.map((u) =>
      addPerks(u, attackerStrategy)
    );

    const defenderUnitsForCombat = defenderUnits.map((u) =>
      addPerks(u, defenderStrategy)
    );

    /*** Create effectiveness matrix
     * A function that returns effectiveness multiplier based on attacker and defender unit types
     */
    const effectivenessTable =
      await this.unitTypeService.getAllEffectivenessRelations();

    const effectivenessMatrix = createEffectivenessMatrix(effectivenessTable);

    /**
     * Create army states for combat
     */
    const attackerArmyState: ArmyState = {
      armyId: attackerArmy.id,
      units: attackerUnitsForCombat,
      role: "attacker",
    };

    const defenderArmyState: ArmyState = {
      armyId: defenderArmy.id,
      units: defenderUnitsForCombat,
      role: "defender",
    };

    /**
     * Simulate battle
     */
    const battleResult = simulateBattle(
      attackerArmyState,
      defenderArmyState,
      effectivenessMatrix
    );

    const { winner, attackerStats, defenderStats } = battleResult;

    /*** Prepare battle log
     * - Determine winner details
     * - Structure battle log
     */
    const winnerArmy = [attackerArmy, defenderArmy].find(
      (a) => a.id === winner
    );

    // Determine winner role
    const winnerRole = winnerArmy
      ? winnerArmy.id === attackerArmyId
        ? "attacker"
        : "defender"
      : null;

    /**
     * Store battle and related data
     */
    const battle = await this.battleModel.createBattle(location);

    await this.battleModel.createBattleArmy(
      battle.id,
      attackerArmyId,
      attackerStrategyId,
      "attacker",
      winnerRole === "attacker" ? "won" : "lost",
      attackerStats.starting_strength,
      attackerStats.final_strength,
      attackerStats.casualties
    );

    await this.battleModel.createBattleArmy(
      battle.id,
      defenderArmyId,
      defenderStrategyId,
      "defender",
      winnerRole === "defender" ? "won" : "lost",
      defenderStats.starting_strength,
      defenderStats.final_strength,
      defenderStats.casualties
    );

    // Structure battle log
    const battleLog: BattleLog = {
      battleId: battle.id,
      date: battle.date,
      location: battle.location,
      winner: winnerArmy
        ? {
            army_id: winnerArmy.id,
            name: winnerArmy.name,
            role: winnerRole,
          }
        : "draw",
      attackerStats: {
        ...attackerStats,
        army_id: attackerArmy.id,
        name: attackerArmy.name,
      },
      defenderStats: {
        ...defenderStats,
        army_id: defenderArmy.id,
        name: defenderArmy.name,
      },
      total_rounds: battleResult.rounds.length,
      rounds: battleResult.rounds,
    };

    return battleLog;
  }

  async getAllBattles(): Promise<Battle[]> {
    return await this.battleModel.findAll();
  }

  async getBattleById(battleId: string): Promise<Battle | null> {
    return await this.battleModel.findById(battleId);
  }

  async getBattlesByArmyId(armyId: string): Promise<any[]> {
    return await this.battleModel.findByArmyId(armyId);
  }

  async deleteBattle(battleId: string): Promise<void> {
    return await this.battleModel.delete(battleId);
  }

  async getBattleReport(battleId: string): Promise<BattleReport | null> {
    const rows = await this.battleModel.getReport(battleId);
    if (!rows) {
      return null;
    }

    const winner: Winner =
      rows[0].outcome === "won"
        ? {
            army_id: rows[0].army_id,
            name: rows[0].army_name,
            role: "attacker",
          }
        : rows[1].outcome === "won"
        ? {
            army_id: rows[1].army_id,
            name: rows[1].army_name,
            role: "defender",
          }
        : "draw";

    const report = {
      battleId,
      date: rows[0].date,
      location: rows[0].location,
      winner,
      armies: [
        {
          army_id: rows[0].army_id,
          name: rows[0].army_name,
          army_owner: rows[0].user_name,
          strategy: rows[0].strategy_name,
          starting_strength: rows[0].starting_strength,
          final_strength: rows[0].final_strength,
          casualties: rows[0].casualties,
          role: rows[0].role,
          outcome: rows[0].outcome,
        },
        {
          army_id: rows[1].army_id,
          name: rows[1].army_name,
          army_owner: rows[1].user_name,
          strategy: rows[1].strategy_name,
          starting_strength: rows[1].starting_strength,
          final_strength: rows[1].final_strength,
          casualties: rows[1].casualties,
          role: rows[1].role,
          outcome: rows[1].outcome,
        },
      ],
    };
    return report;
  }
}
