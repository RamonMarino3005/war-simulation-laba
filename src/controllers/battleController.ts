import { Request, Response } from "express";
import { BattleLog, StartBattleFields } from "types/entities/battleTypes.js";
import { IBattleService } from "types/services/IBattleService.js";

/**
 * Controller responsible for managing battles.
 *
 * Provides endpoints for listing, retrieving, starting, deleting,
 * and reporting battles between armies.
 */
export class BattleController {
  constructor(private battleService: IBattleService) {}

  /**
   * Retrieves all battles in the system.
   *
   * @route GET /battles
   * @param req - Express request
   * @param res - Express response
   * @returns 200 with a list of battles, or 400 on error
   */
  listBattles = async (req: Request, res: Response) => {
    try {
      const battles = await this.battleService.getAllBattles();
      res.status(200).json(battles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Retrieves a single battle by its ID.
   *
   * @route GET /battles/:id
   * @param req - Express request containing `id` parameter
   * @param res - Express response
   * @returns 200 with the battle, 404 if not found, or 400 on error
   */
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

  /**
   * Retrieves all battles involving a specific army.
   *
   * @route GET /army/:armyId
   * @param req - Express request containing `armyId` parameter
   * @param res - Express response
   * @returns 200 with a list of battles, or 400 on error
   */
  getBattlesByArmyId = async (req: Request, res: Response) => {
    const armyId = req.params.armyId;

    try {
      const battles = await this.battleService.getBattlesByArmyId(armyId);
      res.status(200).json(battles);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Initiates a new battle between two armies.
   *
   * @route POST /battles
   * @param req - Express request containing attacker/defender details and strategies
   * @param res - Express response
   * @returns 201 with the battle result log, or 400 on error
   */
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

  /**
   * Deletes a battle by its ID.
   *
   * @route DELETE /battles/:id
   * @param req - Express request containing `id` parameter
   * @param res - Express response
   * @returns 204 on successful deletion, or 400 on error
   */
  deleteBattle = async (req: Request, res: Response) => {
    const battleId = req.params.id;
    try {
      await this.battleService.deleteBattle(battleId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Retrieves the report of a specific battle.
   *
   * @route GET /battles/report/:battleId
   * @param req - Express request containing `battleId` parameter
   * @param res - Express response
   * @returns 200 with the battle report, 404 if not found, or 400 on error
   */
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
