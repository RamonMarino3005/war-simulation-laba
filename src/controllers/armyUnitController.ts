import { Request, Response } from "express";
import { IArmyUnitService } from "types/services/IArmyUnitService.js";

/**
 * Controller for handling operations related to units within an army.
 *
 * Provides endpoints to add, update, remove, and retrieve units in armies.
 */
export class ArmyUnitController {
  constructor(private armyUnitService: IArmyUnitService) {}

  /**
   * Adds a unit to an army.
   *
   * @route POST /army/:armyId/units/:unitId
   * @param req - Express request containing `armyId` and `unitId` in params, and `quantity` in validated body
   * @param res - Express response object
   * @returns 200 with the result of the operation, or 400 on error
   */
  addUnitToArmy = async (req: Request, res: Response) => {
    const { armyId } = req.params;
    const unitId = Number(req.params.unitId);
    const quantity = (req.validatedBody as { quantity: number }).quantity || 1;
    const { userId } = req.session;

    try {
      const result = await this.armyUnitService.addUnitToArmy(
        armyId,
        unitId,
        quantity,
        userId
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Retrieves all units within a specific army.
   *
   * @route GET /army/:armyId
   * @param req - Express request containing `armyId` in params
   * @param res - Express response object
   * @returns 200 with a list of units, or 400 on error
   */
  getUnitsInArmy = async (req: Request, res: Response) => {
    const { armyId } = req.params;

    try {
      const units = await this.armyUnitService.getUnitsInArmy(armyId);
      res.status(200).json(units);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Removes a specific unit from an army.
   *
   * @route DELETE /army/:armyId/units/:unitId
   * @param req - Express request containing `armyId` and `unitId` in params
   * @param res - Express response object
   * @returns 200 with the result of the operation, or 400 on error
   */
  removeUnitFromArmy = async (req: Request, res: Response) => {
    const { armyId } = req.params;
    const unitId = Number(req.params.unitId);
    const { userId } = req.session;

    try {
      const result = await this.armyUnitService.removeUnitFromArmy(
        armyId,
        unitId,
        userId
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Updates the quantity of a specific unit in an army.
   *
   * @route PUT /army/:armyId/units/:unitId
   * @param req - Express request containing `armyId` and `unitId` in params, and `quantity` in validated body
   * @param res - Express response object
   * @returns 200 with the updated unit, or 400 on error
   */
  updateUnitInArmy = async (req: Request, res: Response) => {
    const { armyId } = req.params;
    const unitId = Number(req.params.unitId);
    const { quantity } = req.validatedBody as { quantity: number };
    const { userId } = req.session;

    try {
      const result = await this.armyUnitService.updateUnitInArmy(
        armyId,
        unitId,
        quantity,
        userId
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Retrieves details of a specific unit within an army.
   *
   * @route GET /army/:armyId/units/:unitId
   * @param req - Express request containing `armyId` and `unitId` in params
   * @param res - Express response object
   * @returns 200 with the unit details, or 400 on error
   */
  getUnitInArmy = async (req: Request, res: Response) => {
    const { armyId } = req.params;
    const unitId = Number(req.params.unitId);
    try {
      const unit = await this.armyUnitService.getUnitInArmy(armyId, unitId);
      res.status(200).json(unit);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}
