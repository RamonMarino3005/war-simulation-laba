import {
  EffectivenessRelation,
  EffectivenessTableCreation,
  UnitType,
  UnitTypeCreate,
  UnitTypeFields,
} from "types/entities/unitTypes.js";

export interface IUnitTypeService {
  getAllUnitTypes(): Promise<UnitType[]>;
  getUnitTypeById(unitTypeId: number): Promise<UnitType | null>;
  createUnitType(newUnitType: UnitTypeCreate): Promise<UnitType>;
  updateUnitType(
    unitTypeId: number,
    unitTypeData: Partial<UnitTypeFields>
  ): Promise<UnitType | null>;
  deleteUnitType(unitTypeId: number): Promise<boolean>;
  createEffectivenessRelation(
    attacker_unit_id: number,
    defender_unit_id: number,
    modifier: number
  ): Promise<void>;
  updateUnitTypeEffectiveness(
    unitTypeId: number,
    relationships: EffectivenessTableCreation
  ): Promise<void>;
  getAllEffectivenessRelations(): Promise<Array<EffectivenessRelation>>;
  getEffectivenessRelationsByUnitType(
    unitTypeId: number
  ): Promise<Array<EffectivenessRelation>>;
}
