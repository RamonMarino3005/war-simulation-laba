import { Request, Response } from "express";
import { UnitTypeCreate, UnitTypeFields } from "types/entities/unitTypes.js";
import { IUnitTypeService } from "types/services/IUnitTypeService.js";

export class UnitTypeController {
  constructor(private unitTypeService: IUnitTypeService) {}

  getAllUnitTypes = async (req: Request, res: Response) => {
    try {
      const unitTypes = await this.unitTypeService.getAllUnitTypes();
      res.status(200).json(unitTypes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getUnitTypeById = async (req: Request, res: Response) => {
    const unitTypeId = Number(req.params.id);

    try {
      const unitType = await this.unitTypeService.getUnitTypeById(unitTypeId);
      if (unitType) {
        res.status(200).json(unitType);
      } else {
        res.status(404).json({ error: "Unit Type not found" });
      }
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  createUnitType = async (req: Request, res: Response) => {
    const newUnitType = req.validatedBody as UnitTypeCreate;

    try {
      const createdUnitType = await this.unitTypeService.createUnitType(
        newUnitType
      );
      res.status(201).json(createdUnitType);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  updateUnitType = async (req: Request, res: Response) => {
    const unitTypeId = Number(req.params.id);
    const updateUnitType = req.validatedBody as Partial<UnitTypeFields>;

    console.log("Updating Unit Type with data:", updateUnitType);
    console.log("Unit Type ID:", unitTypeId);
    try {
      const result = await this.unitTypeService.updateUnitType(
        unitTypeId,
        updateUnitType
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  deleteUnitType = async (req: Request, res: Response) => {
    const unitTypeId = Number(req.params.id);

    console.log("Deleting Unit Type ID:", unitTypeId);
    try {
      const result = await this.unitTypeService.deleteUnitType(unitTypeId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  updateUnitTypeEffectiveness = async (req: Request, res: Response) => {
    const unitTypeId = Number(req.params.id);
    const { effectiveness } = req.validatedBody as any;
    try {
      await this.unitTypeService.updateUnitTypeEffectiveness(
        unitTypeId,
        effectiveness
      );
      res.status(200).json({ message: "Effectiveness updated successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getAllEffectivenessRelations = async (req: Request, res: Response) => {
    try {
      const relations =
        await this.unitTypeService.getAllEffectivenessRelations();
      console.log("Fetched Relations:", relations);
      res.status(200).json(relations);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  getEffectivenessRelationsByUnitType = async (req: Request, res: Response) => {
    const unitTypeId = Number(req.params.id);
    try {
      const relations =
        await this.unitTypeService.getEffectivenessRelationsByUnitType(
          unitTypeId
        );
      res.status(200).json(relations);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
}
