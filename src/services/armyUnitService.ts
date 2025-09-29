import {
  ArmyUnit,
  UnitInArmyResponse,
  UnitsInArmyResponse,
} from "types/entities/armyUnitTypes.js";
import { IArmyUnitModel } from "types/models/IArmyUnitModel.js";
import { IArmyService } from "types/services/IArmyService.js";
import { IArmyUnitService } from "types/services/IArmyUnitService.js";
import { IUnitTypeService } from "types/services/IUnitTypeService.js";

/**
 * Service responsible for managing units within armies.
 * Handles adding, updating, retrieving, and removing units.
 */
export class ArmyUnitService implements IArmyUnitService {
  constructor(
    private armyUnitModel: IArmyUnitModel,
    private armyService: IArmyService,
    private unitTypeService: IUnitTypeService
  ) {}

  /**
   * Updates the quantity of a specific unit in an army.
   * Checks user ownership and resource availability.
   *
   * @param armyId - ID of the army
   * @param unitId - ID of the unit type
   * @param quantity - Quantity change (can be positive or negative)
   * @param userId - ID of the user performing the update
   * @returns Updated ArmyUnit object or null
   * @throws Error if army/unit/unit type not found, user unauthorized, insufficient resources or quantity
   */
  async updateUnitInArmy(
    armyId: string,
    unitId: number,
    quantity: number,
    userId: string
  ): Promise<ArmyUnit | null> {
    const response = await this.armyUnitModel.getUnitWithArmyAndType(
      armyId,
      unitId
    );

    if (!response) {
      throw new Error("Army, unit type, or army unit not found");
    }

    const {
      name,
      resources: army_resources,
      unit_cost,
      owner_id,
      unit_quantity_in_army,
    } = response;

    if (owner_id !== userId) throw new Error("User does not own this army");

    const resourcesAvailable = army_resources;
    const costDifference = unit_cost * quantity;
    const remainingResources = resourcesAvailable - costDifference;

    if (remainingResources < 0)
      throw new Error("Insufficient resources in army");

    const newQuantity = unit_quantity_in_army + quantity;
    if (newQuantity < 0) throw new Error("Insufficient unit quantity in army");

    const updatedUnit = await this.armyUnitModel.updateUnitInArmy(
      armyId,
      unitId,
      newQuantity
    );
    await this.armyService.updateArmy(owner_id, armyId, {
      name,
      resources: remainingResources,
    });

    return updatedUnit;
  }

  /**
   * Adds a unit to an army.
   * If the unit already exists, it increments the quantity.
   *
   * @param armyId - ID of the army
   * @param unitId - ID of the unit type
   * @param quantity - Quantity to add (default is 1)
   * @param userId - ID of the user performing the operation
   * @returns The added or updated ArmyUnit
   * @throws Error if army/unit type not found, user unauthorized, or insufficient resources
   */
  async addUnitToArmy(
    armyId: string,
    unitId: number,
    quantity: number = 1,
    userId: string
  ): Promise<ArmyUnit | null> {
    if (quantity <= 0) throw new Error("Quantity must be greater than zero");

    const army = await this.armyService.getArmyById(armyId);
    if (!army) throw new Error("Army not found");

    const unitType = await this.unitTypeService.getUnitTypeById(unitId);
    if (!unitType) throw new Error("Unit type not found");

    const existingUnit = await this.armyUnitModel.getUnitInArmy(armyId, unitId);
    if (existingUnit) {
      const updatedUnit = await this.updateUnitInArmy(
        armyId,
        unitId,
        quantity,
        userId
      );
      return updatedUnit;
    }

    const { name, resources, owner_id } = army;
    const { cost: unit_cost } = unitType;

    if (owner_id !== userId) throw new Error("User does not own this army");

    const resourcesAvailable = resources;
    const totalCost = unit_cost * quantity;

    if (resourcesAvailable < totalCost)
      throw new Error("Insufficient resources in army");

    const newUnit = await this.armyUnitModel.addUnitToArmy(
      armyId,
      unitId,
      quantity
    );
    await this.armyService.updateArmy(owner_id, armyId, {
      name,
      resources: resourcesAvailable - unit_cost,
    });

    return newUnit;
  }

  /**
   * Retrieves all units in a specific army.
   *
   * @param armyId - ID of the army
   * @returns UnitsInArmyResponse containing army ID and unit list
   * @throws Error if army not found
   */
  async getUnitsInArmy(armyId: string): Promise<UnitsInArmyResponse> {
    const army = await this.armyService.getArmyById(armyId);
    if (!army) throw new Error("Army not found");

    const response = await this.armyUnitModel.getUnitsInArmy(armyId);
    return { army_id: armyId, units: response || [] };
  }

  /**
   * Removes all units of a specific type from an army.
   * Updates army resources accordingly.
   *
   * @param armyId - ID of the army
   * @param unitId - ID of the unit type
   * @param userId - ID of the user performing the removal
   * @returns The removed ArmyUnit
   * @throws Error if army/unit/unit type not found or user unauthorized
   */
  async removeUnitFromArmy(
    armyId: string,
    unitId: number,
    userId: string
  ): Promise<ArmyUnit | null> {
    const response = await this.armyUnitModel.getUnitWithArmyAndType(
      armyId,
      unitId
    );

    if (!response) {
      throw new Error("Army, unit type, or army unit not found");
    }

    const { name, resources, unit_cost, owner_id, unit_quantity_in_army } =
      response;

    if (owner_id !== userId) throw new Error("User does not own this army");

    const resourcesGained = unit_cost * unit_quantity_in_army;

    const removedUnits = await this.armyUnitModel.removeAllUnitsFromArmy(
      armyId,
      unitId
    );
    await this.armyService.updateArmy(owner_id, armyId, {
      name,
      resources: resources + resourcesGained,
    });

    return removedUnits;
  }

  /**
   * Retrieves a specific unit in an army.
   *
   * @param armyId - ID of the army
   * @param unitId - ID of the unit type
   * @returns UnitInArmyResponse containing army ID and unit, or null if not found
   * @throws Error if army or unit type not found
   */
  async getUnitInArmy(
    armyId: string,
    unitId: number
  ): Promise<UnitInArmyResponse | null> {
    const army = await this.armyService.getArmyById(armyId);
    if (!army) throw new Error("Army not found");

    const unitType = await this.unitTypeService.getUnitTypeById(unitId);
    if (!unitType) throw new Error("Unit type not found");

    const response = await this.armyUnitModel.getUnitInArmy(armyId, unitId);
    return response ? { army_id: armyId, unit: response } : null;
  }
}
