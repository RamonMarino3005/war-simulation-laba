import {
  ArmyUnit,
  UnitInArmy,
  UnitWithArmyAndType,
} from "types/entities/armyUnitTypes.js";

export interface IArmyUnitModel {
  addUnitToArmy(
    armyId: string,
    unitId: number,
    quantity: number
  ): Promise<ArmyUnit | null>;
  getUnitsInArmy(armyId: string): Promise<UnitInArmy[]>;
  getUnitInArmy(armyId: string, unitId: number): Promise<UnitInArmy | null>;
  getUnitWithArmyAndType(
    armyId: string,
    unitId: number
  ): Promise<UnitWithArmyAndType | null>;
  removeAllUnitsFromArmy(
    armyId: string,
    unitId: number
  ): Promise<ArmyUnit | null>;
  updateUnitInArmy(
    armyId: string,
    unitId: number,
    quantity: number
  ): Promise<ArmyUnit | null>;
}
