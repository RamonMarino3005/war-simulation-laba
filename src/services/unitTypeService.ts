import {
  EffectivenessRelation,
  EffectivenessTableCreation,
  UnitType,
  UnitTypeCreate,
  UnitTypeFields,
} from "types/entities/unitTypes.js";
import { IUnitTypeModel } from "types/models/IUnitTypeModel.js";
import { IUnitTypeService } from "types/services/IUnitTypeService.js";

/**
 * Service responsible for managing unit types and their effectiveness relationships.
 */
export class UnitTypeService implements IUnitTypeService {
  constructor(private unitTypeModel: IUnitTypeModel) {}

  /**
   * Creates a new Unit Type and its effectiveness relationships.
   *
   * @param newUnitType - Data for the new Unit Type, including optional effectiveness table
   * @returns The newly created UnitType
   * @throws Error if the unit type already exists or provided effectiveness targets do not exist
   */
  async createUnitType(newUnitType: UnitTypeCreate): Promise<UnitType> {
    // Create new Unit Type
    const existingType = await this.unitTypeModel.findByType(newUnitType.type);
    if (existingType) {
      throw new Error("Unit Type with this type already exists");
    }

    const createdUnitType = await this.unitTypeModel.create(newUnitType);

    /**
     * Create effectiveness relationships
     */

    // All Unit Types in DB
    const existingUnits = await this.unitTypeModel.getAll();

    // Effectiveness relationships provided in request or empty array
    const providedTypes = newUnitType.effectiveness || [];

    // Check provided types exist in DB
    for (const rel of providedTypes) {
      if (!existingUnits.find((unit) => unit.type === rel.against)) {
        throw new Error(`Provided type ${rel.against} does not exist`);
      }
    }

    // Create effectiveness relationship table for new unit type
    // All relationships default to 1 if not provided
    const effectivenessTable = await createEffectivenessTable(
      existingUnits,
      providedTypes,
      createdUnitType.id
    );

    // Insert relationships into DB
    for (const relation of effectivenessTable) {
      const { attacker_unit_id, defender_unit_id, modifier } = relation;
      await this.unitTypeModel.createEffectivenessRelation({
        attacker_unit_id,
        defender_unit_id,
        modifier,
      });
    }

    return createdUnitType;
  }

  /**
   * Retrieves a Unit Type by its ID.
   *
   * @param unitTypeId - ID of the unit type
   * @returns The UnitType if found, otherwise null
   */
  async getUnitTypeById(unitTypeId: number): Promise<UnitType | null> {
    return this.unitTypeModel.findById(unitTypeId);
  }

  /**
   * Retrieves all Unit Types.
   *
   * @returns Array of UnitType
   */
  async getAllUnitTypes(): Promise<UnitType[]> {
    return this.unitTypeModel.getAll();
  }

  /**
   * Updates an existing Unit Type.
   *
   * @param unitTypeId - ID of the unit type to update
   * @param unitTypeData - Partial data for updating
   * @returns The updated UnitType
   * @throws Error if unit type not found or type already exists
   */
  async updateUnitType(
    unitTypeId: number,
    unitTypeData: Partial<UnitTypeFields>
  ): Promise<UnitType | null> {
    const unitType = await this.unitTypeModel.findById(unitTypeId);
    if (!unitType) throw new Error("Unit Type not found");

    if (unitTypeData.type) {
      const existingType = await this.unitTypeModel.findByType(
        unitTypeData.type
      );
      if (existingType && existingType.id !== unitTypeId) {
        throw new Error("Unit Type with this type already exists");
      }
    }

    return this.unitTypeModel.update(unitTypeId, unitTypeData);
  }

  /**
   * Deletes a Unit Type.
   *
   * @param unitTypeId - ID of the unit type to delete
   * @returns True if deletion successful
   * @throws Error if unit type not found
   */
  async deleteUnitType(unitTypeId: number): Promise<boolean> {
    const unitType = await this.unitTypeModel.findById(unitTypeId);
    if (!unitType) throw new Error("Unit Type not found");

    await this.unitTypeModel.delete(unitTypeId);
    return true;
  }

  /**
   * Creates a single effectiveness relationship between two unit types.
   *
   * @param attacker_unit_id - Attacking unit type ID
   * @param defender_unit_id - Defending unit type ID
   * @param modifier - Effectiveness modifier
   */
  async createEffectivenessRelation(
    attacker_unit_id: number,
    defender_unit_id: number,
    modifier: number
  ): Promise<void> {
    await this.unitTypeModel.createEffectivenessRelation({
      attacker_unit_id,
      defender_unit_id,
      modifier,
    });
  }

  /**
   * Updates effectiveness relationships for a specific Unit Type.
   *
   * @param unitTypeId - ID of the unit type
   * @param relationships - Table of effectiveness relationships to update
   * @throws Error if unit type or target unit type not found
   */
  async updateUnitTypeEffectiveness(
    unitTypeId: number,
    relationships: EffectivenessTableCreation
  ): Promise<void> {
    const unitType = await this.unitTypeModel.findById(unitTypeId);
    if (!unitType) throw new Error("Unit Type not found");

    for (const relation of relationships) {
      const targetUnit = await this.unitTypeModel.findByType(relation.against);
      if (!targetUnit)
        throw new Error(`Target Unit Type "${relation.against}" not found`);

      if (relation.attacker_modifier) {
        await this.unitTypeModel.updateEffectivenessRelation({
          attacker_unit_id: unitType.id,
          defender_unit_id: targetUnit.id,
          modifier: relation.attacker_modifier,
        });
      }

      if (unitType.id === targetUnit.id) continue; // Avoid duplicating (x <-> x) relationships. They are composed PKs

      if (relation.defender_modifier) {
        await this.unitTypeModel.updateEffectivenessRelation({
          attacker_unit_id: targetUnit.id,
          defender_unit_id: unitType.id,
          modifier: relation.defender_modifier,
        });
      }
    }
  }

  /**
   * Retrieves all effectiveness relationships in the system.
   *
   * @returns Array of EffectivenessRelation
   */
  async getAllEffectivenessRelations(): Promise<Array<EffectivenessRelation>> {
    console.log("Fetching all effectiveness relations");
    return this.unitTypeModel.getAllEffectivenessRelations();
  }

  /**
   * Retrieves effectiveness relationships for a specific Unit Type.
   *
   * @param unitTypeId - ID of the unit type
   * @returns Array of EffectivenessRelation
   */
  async getEffectivenessRelationsByUnitType(
    unitTypeId: number
  ): Promise<Array<EffectivenessRelation>> {
    return this.unitTypeModel.getEffectivenessRelationsByUnitType(unitTypeId);
  }
}

/**
 * Helper function to create a default effectiveness table for a new Unit Type.
 *
 * @param existingUnits - All existing unit types
 * @param providedTypes - Effectiveness relationships provided in request
 * @param unitTypeId - ID of the new unit type
 * @returns Array of default effectiveness relationships
 */
async function createEffectivenessTable(
  existingUnits: UnitType[],
  providedTypes: EffectivenessTableCreation,
  unitTypeId: number
) {
  // Create effectiveness relationship table
  // Default relationships for new unit types are set to 1
  const relationshipTable = existingUnits.reduce((acc, u) => {
    const targetRel = providedTypes.find((rel) => rel.against === u.type);

    const attack_relationship = {
      attacker_unit_id: unitTypeId,
      defender_unit_id: u.id,
      modifier: targetRel?.attacker_modifier || 1,
    };

    acc.push(attack_relationship);

    // Avoid duplicating (x <-> x) relationships. They are composed PKs
    if (u.id !== unitTypeId) {
      const defense_relationship = {
        attacker_unit_id: u.id,
        defender_unit_id: unitTypeId,
        modifier: targetRel?.defender_modifier || 1,
      };

      acc.push(defense_relationship);
    }

    return acc;
  }, [] as Array<{ attacker_unit_id: number; defender_unit_id: number; modifier: number }>);

  return relationshipTable;
}
