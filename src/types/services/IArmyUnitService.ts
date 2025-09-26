import {
  ArmyUnit,
  UnitInArmyResponse,
  UnitsInArmyResponse,
} from "types/entities/armyUnitTypes.js";

export interface IArmyUnitService {
  addUnitToArmy(
    armyId: string,
    unitId: number,
    quantity: number,
    userId: string
  ): Promise<ArmyUnit | null>;
  getUnitsInArmy(armyId: string): Promise<UnitsInArmyResponse | null>;
  getUnitInArmy(
    armyId: string,
    unitId: number
  ): Promise<UnitInArmyResponse | null>;
  removeUnitFromArmy(
    armyId: string,
    unitId: number,
    userId: string
  ): Promise<ArmyUnit | null>;
  updateUnitInArmy(
    armyId: string,
    unitId: number,
    quantity: number,
    userId: string
  ): Promise<ArmyUnit | null>;
}
