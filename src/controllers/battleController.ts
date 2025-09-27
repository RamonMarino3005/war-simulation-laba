import { Request, Response } from "express";
import { BattleLog, StartBattleFields } from "types/entities/battleTypes.js";
import { IBattleService } from "types/services/IBattleService.js";

export class BattleController {
  constructor(private battleService: IBattleService) {}

  listBattles = async (req: Request, res: Response) => {
    try {
      const battles = await this.battleService.getAllBattles();
      res.status(200).json(battles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getBattleById = async (req: Request, res: Response) => {
    const battleId = req.params.id;

    try {
      const battle = await this.battleService.getBattleById(battleId);
      if (!battle) {
        return res.status(404).json({ error: "Battle not found" });
      }
      res.status(200).json(battle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getBattlesByArmyId = async (req: Request, res: Response) => {
    const armyId = req.params.armyId;

    try {
      const battles = await this.battleService.getBattlesByArmyId(armyId);
      res.status(200).json(battles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  startBattle = async (req: Request, res: Response) => {
    const {
      attackerArmyId,
      defenderArmyId,
      location,
      attackerStrategy,
      defenderStrategy,
    } = req.validatedBody as StartBattleFields;

    try {
      const battleResult: BattleLog = await this.battleService.startBattle(
        attackerArmyId,
        defenderArmyId,
        location,
        attackerStrategy,
        defenderStrategy
      );
      res.status(201).json(battleResult);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteBattle = async (req: Request, res: Response) => {
    const battleId = req.params.id;
    try {
      await this.battleService.deleteBattle(battleId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getBattleReport = async (req: Request, res: Response) => {
    const { battleId } = req.params;
    console.log("Controller fetching report for battle ID:", battleId);
    try {
      const report = await this.battleService.getBattleReport(battleId);
      if (!report) {
        return res.status(404).json({ error: "Battle report not found" });
      }
      res.status(200).json(report);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}
