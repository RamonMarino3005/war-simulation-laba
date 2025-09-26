import { Request, Response } from "express";
import { IArmyUnitService } from "types/services/IArmyUnitService.js";

export class ArmyUnitController {
  constructor(private armyUnitService: IArmyUnitService) {}

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

  getUnitsInArmy = async (req: Request, res: Response) => {
    const { armyId } = req.params;

    try {
      const units = await this.armyUnitService.getUnitsInArmy(armyId);
      res.status(200).json(units);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

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
