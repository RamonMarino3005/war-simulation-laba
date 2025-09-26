import {
  ArmyUnit,
  UnitInArmyResponse,
  UnitsInArmyResponse,
} from "types/entities/armyUnitTypes.js";
import { IArmyUnitModel } from "types/models/IArmyUnitModel.js";
import { IArmyService } from "types/services/IArmyService.js";
import { IArmyUnitService } from "types/services/IArmyUnitService.js";
import { IUnitTypeService } from "types/services/IUnitTypeService.js";

export class ArmyUnitService implements IArmyUnitService {
  constructor(
    private armyUnitModel: IArmyUnitModel,
    private armyService: IArmyService,
    private unitTypeService: IUnitTypeService
  ) {}

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

  async getUnitsInArmy(armyId: string): Promise<UnitsInArmyResponse> {
    const army = await this.armyService.getArmyById(armyId);
    if (!army) throw new Error("Army not found");

    const response = await this.armyUnitModel.getUnitsInArmy(armyId);
    return { army_id: armyId, units: response || [] };
  }

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
