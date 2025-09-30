import { Request, Response } from "express";
import { UnitTypeCreate, UnitTypeFields } from "types/entities/unitTypes.js";
import { IUnitTypeService } from "types/services/IUnitTypeService.js";

/**
 * Controller responsible for managing unit types and their effectiveness relations.
 * Provides endpoints for CRUD operations on unit types and handling effectiveness mappings.
 */
export class UnitTypeController {
  constructor(private unitTypeService: IUnitTypeService) {}

  /**
   * Get all unit types.
   *
   * @route GET /unit-types
   * @returns {UnitType[]} 200 - List of all unit types
   * @returns {object} 400 - Error message if retrieval fails
   */
  getAllUnitTypes = async (req: Request, res: Response) => {
    try {
      const unitTypes = await this.unitTypeService.getAllUnitTypes();
      res.status(200).json(unitTypes);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Get a unit type by its ID.
   *
   * @route GET /unit-types/:id
   * @param {number} id - ID of the unit type
   * @returns {UnitType} 200 - Unit type details
   * @returns {object} 404 - Unit type not found
   * @returns {object} 400 - Error message if retrieval fails
   */
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

  /**
   * Create a new unit type.
   *
   * @route POST /unit-types
   * @body {UnitTypeCreate} newUnitType - Unit type data
   * @returns {UnitType} 201 - Created unit type
   * @returns {object} 400 - Error message if creation fails
   */
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

  /**
   * Update an existing unit type.
   *
   * @route PUT /unit-types/:id
   * @param {number} id - ID of the unit type
   * @body {Partial<UnitTypeFields>} updateUnitType - Fields to update
   * @returns {UnitType} 200 - Updated unit type
   * @returns {object} 400 - Error message if update fails
   */
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

  /**
   * Delete a unit type by its ID.
   *
   * @route DELETE /unit-types/:id
   * @param {number} id - ID of the unit type
   * @returns {object} 200 - Success message or result
   * @returns {object} 400 - Error message if deletion fails
   */
  deleteUnitType = async (req: Request, res: Response) => {
    const unitTypeId = Number(req.params.id);

    console.log("Deleting Unit Type ID:", unitTypeId);
    try {
      const result = await this.unitTypeService.deleteUnitType(unitTypeId);

      if (!result) {
        return res.status(404).json({ error: "Unit Type not found" });
      }
      console.log("Deletion Result:", result);

      res.status(200).json({
        status: "success",
        message: "Unit Type deleted successfully",
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  /**
   * Update the effectiveness relations of a unit type.
   *
   * @route PUT /unit-types/effectiveness/:id
   * @param {number} id - ID of the unit type
   * @body {object} effectiveness - Effectiveness relations
   * @returns {object} 200 - Success message
   * @returns {object} 400 - Error message if update fails
   */
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

  /**
   * Get all effectiveness relations between unit types.
   *
   * @route GET /unit-types/effectiveness
   * @returns {object[]} 200 - List of effectiveness relations
   * @returns {object} 400 - Error message if retrieval fails
   */
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

  /**
   * Get effectiveness relations for a specific unit type.
   *
   * @route GET /unit-types/effectiveness/:id
   * @param {number} id - ID of the unit type
   * @returns {object[]} 200 - Effectiveness relations for the given unit type
   * @returns {object} 400 - Error message if retrieval fails
   */
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
